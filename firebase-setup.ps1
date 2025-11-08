# Firebase Quick Setup Script
# Run this script to deploy Firebase rules and initialize services

Write-Host "Firebase Setup for Career Findr" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
Write-Host "Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version 2>&1
    Write-Host "Firebase CLI installed: $firebaseVersion" -ForegroundColor Green
}
catch {
    Write-Host "Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}

Write-Host ""

# Check if logged in
Write-Host "Checking Firebase login..." -ForegroundColor Yellow
try {
    firebase projects:list 2>&1 | Out-Null
    Write-Host "Logged in to Firebase" -ForegroundColor Green
}
catch {
    Write-Host "Not logged in. Running firebase login..." -ForegroundColor Red
    firebase login
}

Write-Host ""
Write-Host "Current Project: career-findr" -ForegroundColor Cyan
Write-Host ""

# Menu
Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host "1. Deploy Firestore Rules" -ForegroundColor White
Write-Host "2. Deploy Storage Rules" -ForegroundColor White
Write-Host "3. Deploy All Rules (Firestore + Storage)" -ForegroundColor White
Write-Host "4. Deploy to Firebase Hosting" -ForegroundColor White
Write-Host "5. Start Firebase Emulators" -ForegroundColor White
Write-Host "6. Build and Deploy Everything" -ForegroundColor White
Write-Host "7. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-7)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Deploying Firestore Rules..." -ForegroundColor Yellow
        firebase deploy --only firestore:rules
        Write-Host "Firestore rules deployed!" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "Deploying Storage Rules..." -ForegroundColor Yellow
        firebase deploy --only storage:rules
        Write-Host "Storage rules deployed!" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "Deploying Firestore and Storage Rules..." -ForegroundColor Yellow
        firebase deploy --only firestore:rules, storage:rules
        Write-Host "All rules deployed!" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "Building React app..." -ForegroundColor Yellow
        Push-Location "client\career-findr"
        npm run build
        Pop-Location
        
        Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Yellow
        firebase deploy --only hosting
        Write-Host "Deployed to Firebase Hosting!" -ForegroundColor Green
        Write-Host "Check the Firebase Console for your live URL" -ForegroundColor Cyan
    }
    "5" {
        Write-Host ""
        Write-Host "Starting Firebase Emulators..." -ForegroundColor Yellow
        Write-Host "Emulator UI will be available at: http://localhost:4000" -ForegroundColor Cyan
        firebase emulators:start
    }
    "6" {
        Write-Host ""
        Write-Host "Building React app..." -ForegroundColor Yellow
        Push-Location "client\career-findr"
        npm run build
        Pop-Location
        
        Write-Host "Deploying rules..." -ForegroundColor Yellow
        firebase deploy --only firestore:rules, storage:rules
        
        Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Yellow
        firebase deploy --only hosting
        
        Write-Host ""
        Write-Host "Everything deployed successfully!" -ForegroundColor Green
        Write-Host "Check the Firebase Console for your live URL" -ForegroundColor Cyan
    }
    "7" {
        Write-Host "Goodbye!" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
