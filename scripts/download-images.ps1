#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Downloads product images from Bing Images for all Zava site types.
.DESCRIPTION
    Reads product data from the API, searches Bing Images using each product's
    name and brand, downloads 1-3 images per product from the search results,
    then resizes them into 3 sizes:
    - main:   600x600
    - medium: 300x300
    - thumb:  150x150
    Stored under src/Zava.Api/wwwroot/images/products/<SiteType>/<ProductId>/
    Falls back to picsum.photos if Bing Images search fails.
.NOTES
    Requirements: Zava API running on http://localhost:5014
    Start API first:  cd src/Zava.Api && dotnet run
    Requires Windows (uses System.Drawing for image resizing).
#>

param(
    [string]$ApiBase = "http://localhost:5014/api",
    [string]$OutputDir = ""
)

$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'

# Load System.Drawing for image resizing
Add-Type -AssemblyName System.Drawing

if (-not $OutputDir) {
    $OutputDir = Join-Path $PSScriptRoot ".." "src" "Zava.Api" "wwwroot" "images" "products"
}

$siteTypes = @("Electronics", "Appliances", "Cosmetics", "Electrical", "DIY", "Grocery")

$sizes = @(
    @{ name = "main";   w = 600; h = 600 },
    @{ name = "medium"; w = 300; h = 300 },
    @{ name = "thumb";  w = 150; h = 150 }
)

$script:browserHeaders = @{
    "User-Agent"      = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    "Accept"          = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    "Accept-Language" = "en-US,en;q=0.9"
}

function Get-ImageCount([int]$productId) {
    $mod = $productId % 6
    if ($mod -lt 2) { return 3 }
    if ($mod -lt 4) { return 2 }
    return 1
}

function Search-BingImageUrls {
    <#
    .SYNOPSIS
        Searches Bing Images and returns full-size image URLs from the results.
        Prioritizes JPEG/PNG URLs over others (to avoid WebP which System.Drawing can't handle).
    #>
    param(
        [string]$Query,
        [int]$Count = 1
    )

    $encodedQuery = [System.Uri]::EscapeDataString($Query)
    $searchUrl = "https://www.bing.com/images/search?q=$encodedQuery&first=1"

    $response = Invoke-WebRequest -Uri $searchUrl -Headers $script:browserHeaders -UseBasicParsing -TimeoutSec 15

    $html = $response.Content

    # Bing embeds image metadata as HTML-encoded JSON with &quot; delimiters
    # Extract full-size image URLs from "murl" (media URL) fields
    $murlMatches = [regex]::Matches($html, '&quot;murl&quot;:&quot;(https?://[^&]+(?:&amp;[^&]*)*?)&quot;')

    $jpegUrls = @()
    $otherUrls = @()
    foreach ($m in $murlMatches) {
        $candidate = $m.Groups[1].Value -replace '&amp;', '&'
        if ($candidate -notmatch 'bing\.com|microsoft\.com|msn\.com') {
            if ($candidate -match '\.(jpg|jpeg|png)([\?&]|$)') {
                $jpegUrls += $candidate
            } else {
                $otherUrls += $candidate
            }
        }
    }

    # Return JPEG/PNG first, then others as fallback. Request more than needed
    # so the caller can skip WebP responses.
    $maxCandidates = [Math]::Max($Count * 3, 10)
    return @($jpegUrls) + @($otherUrls) | Select-Object -First $maxCandidates
}

function Save-ResizedImage {
    <#
    .SYNOPSIS
        Takes image bytes and saves a resized JPEG to the specified path.
    #>
    param(
        [byte[]]$ImageBytes,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )

    $ms = New-Object System.IO.MemoryStream(, $ImageBytes)
    try {
        $srcImage = [System.Drawing.Image]::FromStream($ms)
        $destBitmap = New-Object System.Drawing.Bitmap($Width, $Height)
        $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.DrawImage($srcImage, 0, 0, $Width, $Height)

        # Save as JPEG with quality 90
        $jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]90)
        $destBitmap.Save($OutputPath, $jpegEncoder, $encoderParams)
    }
    finally {
        if ($graphics)   { $graphics.Dispose() }
        if ($destBitmap)  { $destBitmap.Dispose() }
        if ($srcImage)    { $srcImage.Dispose() }
        $ms.Dispose()
    }
}

function Get-FallbackImageUrl([string]$siteType, [int]$prodId, [int]$imageIndex, [int]$w, [int]$h) {
    $seed = "${siteType}_${prodId}_${imageIndex}"
    return "https://picsum.photos/seed/${seed}/${w}/${h}"
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Zava Product Image Downloader (Bing Images)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Output: $OutputDir"
Write-Host ""

# Check API is accessible
Write-Host "Checking API connectivity..." -ForegroundColor Yellow
try {
    $null = Invoke-RestMethod -Uri "$ApiBase/config" -TimeoutSec 5
    Write-Host "  API is running." -ForegroundColor Green
}
catch {
    Write-Host "  ERROR: Cannot reach API at $ApiBase" -ForegroundColor Red
    Write-Host "  Please start the API first: cd src/Zava.Api && dotnet run" -ForegroundColor Red
    exit 1
}

# Ensure output root exists
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null }

$totalDownloaded = 0
$totalSkipped = 0
$totalFailed = 0
$totalFallback = 0
$manifest = @{}

foreach ($siteType in $siteTypes) {
    Write-Host "`n--- $siteType ---" -ForegroundColor Yellow

    # Switch site type
    try {
        $body = @{ siteType = $siteType } | ConvertTo-Json
        $null = Invoke-RestMethod -Uri "$ApiBase/config/site-type" -Method Put -Body $body -ContentType "application/json" -TimeoutSec 10
    }
    catch {
        Write-Warning "  Cannot switch to $siteType, skipping..."
        continue
    }

    # Fetch products
    try {
        $products = Invoke-RestMethod -Uri "$ApiBase/products" -TimeoutSec 10
        Write-Host "  $($products.Count) products"
    }
    catch {
        Write-Warning "  Cannot fetch products, skipping..."
        continue
    }

    $siteDir = Join-Path $OutputDir $siteType
    if (-not (Test-Path $siteDir)) { New-Item -ItemType Directory -Path $siteDir -Force | Out-Null }

    $siteManifest = @{}
    $count = 0

    foreach ($product in $products) {
        $prodId = $product.id
        $prodName = if ($product.nameEn) { $product.nameEn } else { $product.name }
        $prodBrand = $product.brand
        $imageCount = Get-ImageCount $prodId
        $productDir = Join-Path $siteDir $prodId.ToString()

        if (-not (Test-Path $productDir)) { New-Item -ItemType Directory -Path $productDir -Force | Out-Null }

        # Check if all images already exist for this product
        $allExist = $true
        for ($i = 1; $i -le $imageCount; $i++) {
            foreach ($size in $sizes) {
                $fileName = "${i}_$($size.name).jpg"
                if (-not (Test-Path (Join-Path $productDir $fileName))) {
                    $allExist = $false
                    break
                }
            }
            if (-not $allExist) { break }
        }

        if ($allExist) {
            $totalSkipped += ($imageCount * $sizes.Count)
            $productImages = @()
            for ($i = 1; $i -le $imageCount; $i++) {
                $productImages += @{
                    index  = $i
                    main   = "/images/products/$siteType/$prodId/${i}_main.jpg"
                    medium = "/images/products/$siteType/$prodId/${i}_medium.jpg"
                    thumb  = "/images/products/$siteType/$prodId/${i}_thumb.jpg"
                }
            }
            $siteManifest["$prodId"] = $productImages
            $count++
            continue
        }

        # Search Bing Images for this product
        $searchQuery = "$prodName $prodBrand"
        $imageUrls = @()
        try {
            $imageUrls = @(Search-BingImageUrls -Query $searchQuery -Count $imageCount)
            if ($imageUrls.Count -gt 0) {
                Write-Host "  Product $prodId ($prodName): $($imageUrls.Count) Bing result(s)" -ForegroundColor DarkGray
            }
        }
        catch {
            Write-Host "  Product $prodId ($prodName): Bing search failed, using fallback" -ForegroundColor DarkYellow
        }

        $productImages = @()

        for ($i = 1; $i -le $imageCount; $i++) {
            # Check if this specific image set already exists
            $imageExists = $true
            foreach ($size in $sizes) {
                $fileName = "${i}_$($size.name).jpg"
                if (-not (Test-Path (Join-Path $productDir $fileName))) {
                    $imageExists = $false
                    break
                }
            }
            if ($imageExists) {
                $totalSkipped += $sizes.Count
                $productImages += @{
                    index  = $i
                    main   = "/images/products/$siteType/$prodId/${i}_main.jpg"
                    medium = "/images/products/$siteType/$prodId/${i}_medium.jpg"
                    thumb  = "/images/products/$siteType/$prodId/${i}_thumb.jpg"
                }
                continue
            }

            $downloaded = $false
            $imageBytes = $null

            # Try Bing Images results - download to temp file, skip WebP
            $dlHeaders = @{
                "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
                "Accept"     = "image/jpeg,image/png,image/gif;q=0.9,*/*;q=0.1"
            }
            $tempFile = [System.IO.Path]::GetTempFileName()
            $urlOffset = ($i - 1) * 2  # Offset into URL list for multi-image products
            for ($urlIdx = $urlOffset; $urlIdx -lt $imageUrls.Count -and -not $downloaded; $urlIdx++) {
                $bingUrl = $imageUrls[$urlIdx]
                try {
                    Invoke-WebRequest -Uri $bingUrl -Headers $dlHeaders -OutFile $tempFile -TimeoutSec 15 -MaximumRetryCount 1
                    $imageBytes = [System.IO.File]::ReadAllBytes($tempFile)
                    # Skip WebP (RIFF header) - System.Drawing can't handle it
                    if ($imageBytes.Length -ge 4 -and $imageBytes[0] -eq 0x52 -and $imageBytes[1] -eq 0x49 -and $imageBytes[2] -eq 0x46 -and $imageBytes[3] -eq 0x46) {
                        $imageBytes = $null
                        continue
                    }
                    # Validate it's actually an image
                    $testMs = New-Object System.IO.MemoryStream(, $imageBytes)
                    $testImg = [System.Drawing.Image]::FromStream($testMs)
                    $testImg.Dispose()
                    $testMs.Dispose()
                    $downloaded = $true
                }
                catch {
                    $imageBytes = $null
                }
            }
            if (Test-Path $tempFile) { [System.IO.File]::Delete($tempFile) }

            if (-not $downloaded) {
                Write-Host "    Product ${prodId} image ${i}: Bing download failed, falling back" -ForegroundColor DarkYellow
            }

            # Fallback to picsum.photos if Bing didn't work
            if (-not $downloaded) {
                $totalFallback++
                foreach ($size in $sizes) {
                    $sizeName = $size.name
                    $w = $size.w
                    $h = $size.h
                    $fileName = "${i}_${sizeName}.jpg"
                    $filePath = Join-Path $productDir $fileName

                    $fallbackUrl = Get-FallbackImageUrl $siteType $prodId $i $w $h
                    try {
                        Invoke-WebRequest -Uri $fallbackUrl -OutFile $filePath -TimeoutSec 30 -MaximumRetryCount 2
                        $totalDownloaded++
                    }
                    catch {
                        Write-Warning "    FAIL: Product $prodId image $i ($sizeName)"
                        $totalFailed++
                    }
                }

                $productImages += @{
                    index  = $i
                    main   = "/images/products/$siteType/$prodId/${i}_main.jpg"
                    medium = "/images/products/$siteType/$prodId/${i}_medium.jpg"
                    thumb  = "/images/products/$siteType/$prodId/${i}_thumb.jpg"
                }
                continue
            }

            # Resize and save Bing image in all 3 sizes
            foreach ($size in $sizes) {
                $sizeName = $size.name
                $w = $size.w
                $h = $size.h
                $fileName = "${i}_${sizeName}.jpg"
                $filePath = Join-Path $productDir $fileName

                try {
                    Save-ResizedImage -ImageBytes $imageBytes -OutputPath $filePath -Width $w -Height $h
                    $totalDownloaded++
                }
                catch {
                    Write-Warning "    FAIL resize: Product $prodId image $i ($sizeName) - $_"
                    # Fallback: download from picsum directly for this size
                    $fallbackUrl = Get-FallbackImageUrl $siteType $prodId $i $w $h
                    try {
                        Invoke-WebRequest -Uri $fallbackUrl -OutFile $filePath -TimeoutSec 30 -MaximumRetryCount 2
                        $totalDownloaded++
                        $totalFallback++
                    }
                    catch {
                        $totalFailed++
                    }
                }
            }

            $productImages += @{
                index  = $i
                main   = "/images/products/$siteType/$prodId/${i}_main.jpg"
                medium = "/images/products/$siteType/$prodId/${i}_medium.jpg"
                thumb  = "/images/products/$siteType/$prodId/${i}_thumb.jpg"
            }
        }

        $siteManifest["$prodId"] = $productImages
        $count++

        if ($count % 10 -eq 0) {
            Write-Host "  $count / $($products.Count)..." -ForegroundColor DarkGray
        }

        # Delay between products to avoid Google rate-limiting
        Start-Sleep -Milliseconds 500
    }

    $manifest[$siteType] = $siteManifest
    Write-Host "  Done: $count products" -ForegroundColor Green
}

# Save manifest
$manifestPath = Join-Path $OutputDir "manifest.json"
$manifest | ConvertTo-Json -Depth 5 -Compress | Set-Content -Path $manifestPath -Encoding UTF8
Write-Host "`nManifest: $manifestPath" -ForegroundColor Green

# Reset to Electronics
try {
    $body = @{ siteType = "Electronics" } | ConvertTo-Json
    $null = Invoke-RestMethod -Uri "$ApiBase/config/site-type" -Method Put -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "API reset to Electronics" -ForegroundColor Green
}
catch { }

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  Downloaded: $totalDownloaded  Skipped: $totalSkipped  Failed: $totalFailed  Fallback: $totalFallback" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
