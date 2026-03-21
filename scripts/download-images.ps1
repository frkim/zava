#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Downloads product images from picsum.photos for all Zava site types.
.DESCRIPTION
    Reads product data from the API, downloads 1-3 images per product from
    picsum.photos (seeded URLs for consistency), in 3 sizes:
    - main:   600x600
    - medium: 300x300
    - thumb:  150x150
    Stored under src/Zava.Api/wwwroot/images/products/<SiteType>/<ProductId>/
.NOTES
    Requirements: Zava API running on http://localhost:5014
    Start API first:  cd src/Zava.Api && dotnet run
#>

param(
    [string]$ApiBase = "http://localhost:5014/api",
    [string]$OutputDir = ""
)

$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'

if (-not $OutputDir) {
    $OutputDir = Join-Path $PSScriptRoot ".." "src" "Zava.Api" "wwwroot" "images" "products"
}

$siteTypes = @("Electronics", "Appliances", "Cosmetics", "Electrical", "DIY", "Grocery")

$sizes = @(
    @{ name = "main";   w = 600; h = 600 },
    @{ name = "medium"; w = 300; h = 300 },
    @{ name = "thumb";  w = 150; h = 150 }
)

function Get-ImageCount([int]$productId) {
    $mod = $productId % 6
    if ($mod -lt 2) { return 3 }
    if ($mod -lt 4) { return 2 }
    return 1
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Zava Product Image Downloader" -ForegroundColor Cyan
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
        $imageCount = Get-ImageCount $prodId
        $productDir = Join-Path $siteDir $prodId.ToString()

        if (-not (Test-Path $productDir)) { New-Item -ItemType Directory -Path $productDir -Force | Out-Null }

        $productImages = @()

        for ($i = 1; $i -le $imageCount; $i++) {
            foreach ($size in $sizes) {
                $sizeName = $size.name
                $w = $size.w
                $h = $size.h
                $fileName = "${i}_${sizeName}.jpg"
                $filePath = Join-Path $productDir $fileName

                if (Test-Path $filePath) {
                    $totalSkipped++
                    continue
                }

                $seed = "${siteType}_${prodId}_${i}"
                $url = "https://picsum.photos/seed/${seed}/${w}/${h}"

                try {
                    Invoke-WebRequest -Uri $url -OutFile $filePath -TimeoutSec 30 -MaximumRetryCount 2
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
        }

        $siteManifest["$prodId"] = $productImages
        $count++

        if ($count % 20 -eq 0) {
            Write-Host "  $count / $($products.Count)..." -ForegroundColor DarkGray
        }

        Start-Sleep -Milliseconds 50
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
Write-Host "  Downloaded: $totalDownloaded  Skipped: $totalSkipped  Failed: $totalFailed" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
