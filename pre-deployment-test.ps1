# Pre-Deployment Test Script
# Run this before deploying to catch any issues

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Career Findr - Pre-Deployment Test" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Test 1: Check Firebase CLI
Write-Host "[1/7] Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $version = firebase --version 2>&1
    Write-Host "  Firebase CLI installed: $version" -ForegroundColor Green
}
catch {
    Write-Host "  Firebase CLI not found!" -ForegroundColor Red
    $allPassed = $false
}

# Test 2: Check if logged in
Write-Host "[2/7] Checking Firebase login..." -ForegroundColor Yellow
firebase projects:list 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Logged in to Firebase" -ForegroundColor Green
}
else {
    Write-Host "  Not logged in to Firebase" -ForegroundColor Red
    $allPassed = $false
}

# Test 3: Check client dependencies
Write-Host "[3/7] Checking client dependencies..." -ForegroundColor Yellow
if (Test-Path "client\career-findr\node_modules") {
    Write-Host "  Client dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "  Client dependencies missing!" -ForegroundColor Red
    $allPassed = $false
}

# Test 4: Check environment files
Write-Host "[4/7] Checking environment files..." -ForegroundColor Yellow
if ((Test-Path "client\career-findr\.env") -and (Test-Path "client\career-findr\.env.production")) {
    Write-Host "  Environment files exist" -ForegroundColor Green
}
else {
    Write-Host "  Environment files missing!" -ForegroundColor Red
    $allPassed = $false
}

# Test 5: Check firebase.json
Write-Host "[5/7] Checking firebase.json..." -ForegroundColor Yellow
if (Test-Path "firebase.json") {
    Write-Host "  firebase.json exists" -ForegroundColor Green
}
else {
    Write-Host "  firebase.json not found!" -ForegroundColor Red
    $allPassed = $false
}

# Test 6: Check rules files
Write-Host "[6/7] Checking Firebase rules files..." -ForegroundColor Yellow
if ((Test-Path "firestore.rules") -and (Test-Path "storage.rules")) {
    Write-Host "  Rules files exist" -ForegroundColor Green
}
else {
    Write-Host "  Rules files missing!" -ForegroundColor Red
    $allPassed = $false
}

# Test 7: Check if previous build exists
Write-Host "[7/7] Checking for previous build..." -ForegroundColor Yellow
if (Test-Path "client\career-findr\dist") {
    Write-Host "  Build folder exists" -ForegroundColor Green
}
else {
    Write-Host "  No previous build found (will build during deployment)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "  Ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Next: Run .\firebase-setup.ps1" -ForegroundColor White
    Write-Host "  Choose option 6 to build and deploy everything" -ForegroundColor White
}
else {
    Write-Host "  SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "  Please fix the issues above" -ForegroundColor Red
}
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
