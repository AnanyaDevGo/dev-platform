# Run from the server folder in PowerShell:
#   .\setup.ps1

$ErrorActionPreference = "Stop"
$ServerRoot = $PSScriptRoot

# Prefer real Python over the Microsoft Store stub
$PythonCandidates = @(
    "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe"
)

$Python = $PythonCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $Python) {
    $Python = (Get-Command py -ErrorAction SilentlyContinue).Source
    if ($Python) { $Python = "py -3.12" }
}

if (-not $Python) {
    Write-Host "Python not found. Install Python 3.12 first:" -ForegroundColor Red
    Write-Host "  winget install Python.Python.3.12"
    exit 1
}

Set-Location $ServerRoot

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Host "Creating virtual environment..."
    if ($Python -like "py *") {
        Invoke-Expression "$Python -m venv .venv"
    } else {
        & $Python -m venv .venv
    }
}

$VenvPython = Join-Path $ServerRoot ".venv\Scripts\python.exe"
$VenvPip = Join-Path $ServerRoot ".venv\Scripts\pip.exe"
$VenvAlembic = Join-Path $ServerRoot ".venv\Scripts\alembic.exe"
$VenvUvicorn = Join-Path $ServerRoot ".venv\Scripts\uvicorn.exe"

Write-Host "Installing Python dependencies..."
& $VenvPip install -r requirements.txt

Write-Host "Running database migrations..."
& $VenvAlembic upgrade head

Write-Host "Seeding default data..."
& $VenvPython scripts\seed.py

Write-Host ""
Write-Host "Setup complete. Start the API with:" -ForegroundColor Green
Write-Host "  .\.venv\Scripts\uvicorn.exe app.main:app --reload --port 4000"
Write-Host ""
Write-Host "Default admin login: admin@example.com / Admin1234"
