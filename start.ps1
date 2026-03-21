$Host.UI.RawUI.WindowTitle = "Zava - E-commerce Demo"
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Zava - Lancement local" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que dotnet est installé
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Host "[ERREUR] dotnet n'est pas installé." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier que node est installé
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERREUR] Node.js n'est pas installé." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

$rootDir = $PSScriptRoot
$backendProject = Join-Path $rootDir "src\Zava.Api\Zava.Api.csproj"
$frontendDir = Join-Path $rootDir "src\Zava.Web"

# Installer les dépendances frontend si nécessaire
if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "[1/4] Installation des dépendances frontend..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install
    Pop-Location
} else {
    Write-Host "[1/4] Dépendances frontend OK" -ForegroundColor Green
}

# Build backend
Write-Host "[2/4] Build du backend..." -ForegroundColor Yellow
dotnet build $backendProject --nologo -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERREUR] Le build du backend a échoué." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}
Write-Host "      Backend OK" -ForegroundColor Green

# Lancer le backend en arrière-plan
Write-Host "[3/4] Démarrage du backend (http://localhost:5014)..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath "dotnet" -ArgumentList "run", "--project", $backendProject, "--no-build" -PassThru -WindowStyle Normal

# Trap pour arrêter proprement le backend à la fermeture
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    if ($backendJob -and -not $backendJob.HasExited) {
        Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    }
}

# Lancer le frontend
Write-Host "[4/4] Démarrage du frontend (http://localhost:5173)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Backend  : http://localhost:5014" -ForegroundColor White
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor White
Write-Host "  API docs : http://localhost:5014/openapi/v1.json" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour tout arrêter." -ForegroundColor DarkGray
Write-Host ""

try {
    Push-Location $frontendDir
    npm run dev
} finally {
    Pop-Location
    # Arrêter le backend quand le frontend s'arrête
    if ($backendJob -and -not $backendJob.HasExited) {
        Write-Host ""
        Write-Host "Arrêt du backend..." -ForegroundColor Yellow
        Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Backend arrêté." -ForegroundColor Green
    }
}
