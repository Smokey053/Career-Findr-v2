# Backend Configuration Helper Script
# This script helps you set up the backend server

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   Career Findr - Backend Configuration" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Check if serviceAccountKey.json exists
$serviceKeyPath = ".\serviceAccountKey.json"
if (Test-Path $serviceKeyPath) {
    Write-Host "[OK] Found serviceAccountKey.json" -ForegroundColor Green
    
    # Read and parse the service account key
    try {
        $serviceKey = Get-Content $serviceKeyPath | ConvertFrom-Json
        
        Write-Host "`n[INFO] Service Account Details:" -ForegroundColor Yellow
        Write-Host "  Project ID: $($serviceKey.project_id)" -ForegroundColor White
        Write-Host "  Client Email: $($serviceKey.client_email)" -ForegroundColor White
        Write-Host "  Client ID: $($serviceKey.client_id)" -ForegroundColor White
        
        # Check if .env already has these values
        $envPath = ".\.env"
        $envContent = Get-Content $envPath -Raw
        
        if ($envContent -match "FIREBASE_PRIVATE_KEY_ID=") {
            Write-Host "`n[INFO] Firebase credentials already in .env" -ForegroundColor Yellow
            $update = Read-Host "`nDo you want to update them? (y/n)"
            if ($update -ne "y") {
                Write-Host "[SKIP] Keeping existing credentials" -ForegroundColor Yellow
                return
            }
        }
        
        # Update .env file
        Write-Host "`n[ACTION] Updating .env file..." -ForegroundColor Cyan
        
        # Remove old Firebase Admin credentials if they exist
        $envContent = $envContent -replace "FIREBASE_PRIVATE_KEY_ID=.*`n", ""
        $envContent = $envContent -replace "FIREBASE_PRIVATE_KEY=.*`n", ""
        $envContent = $envContent -replace "FIREBASE_CLIENT_EMAIL=.*`n", ""
        $envContent = $envContent -replace "FIREBASE_CLIENT_ID=.*`n", ""
        $envContent = $envContent -replace "FIREBASE_CLIENT_CERT_URL=.*`n", ""
        
        # Add new credentials
        $privateKey = $serviceKey.private_key -replace "`n", "\n"
        $newCredentials = @"

# Firebase Admin SDK Credentials (Auto-generated from serviceAccountKey.json)
FIREBASE_PRIVATE_KEY_ID=$($serviceKey.private_key_id)
FIREBASE_PRIVATE_KEY="$privateKey"
FIREBASE_CLIENT_EMAIL=$($serviceKey.client_email)
FIREBASE_CLIENT_ID=$($serviceKey.client_id)
FIREBASE_CLIENT_CERT_URL=$($serviceKey.client_x509_cert_url)
"@
        
        $envContent = $envContent.TrimEnd() + "`n" + $newCredentials
        Set-Content -Path $envPath -Value $envContent -NoNewline
        
        Write-Host "[SUCCESS] Firebase Admin credentials added to .env" -ForegroundColor Green
        
    }
    catch {
        Write-Host "[ERROR] Failed to read serviceAccountKey.json: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
    
}
else {
    Write-Host "[WARNING] serviceAccountKey.json not found!" -ForegroundColor Red
    Write-Host "`nTo get your service account key:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.firebase.google.com/project/career-findr/settings/serviceaccounts/adminsdk" -ForegroundColor White
    Write-Host "2. Click 'Generate new private key'" -ForegroundColor White
    Write-Host "3. Save as 'serviceAccountKey.json' in this folder" -ForegroundColor White
    Write-Host "4. Run this script again`n" -ForegroundColor White
    exit 1
}

# Check if backend dependencies are installed
Write-Host "`n[CHECK] Checking backend dependencies..." -ForegroundColor Cyan
$nodeModules = ".\node_modules"
if (!(Test-Path $nodeModules)) {
    Write-Host "[INFO] Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "[SUCCESS] Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
}

# Check client .env configuration
Write-Host "`n[CHECK] Checking client configuration..." -ForegroundColor Cyan
$clientEnvPath = ".\client\career-findr\.env"
if (Test-Path $clientEnvPath) {
    $clientEnv = Get-Content $clientEnvPath -Raw
    
    if ($clientEnv -match "VITE_API_URL=http://localhost:5000/api") {
        Write-Host "[OK] Client is configured to use backend API" -ForegroundColor Green
    }
    elseif ($clientEnv -match "# VITE_API_URL=") {
        Write-Host "[WARNING] Client API URL is commented out" -ForegroundColor Yellow
        $updateClient = Read-Host "Enable backend API in client? (y/n)"
        if ($updateClient -eq "y") {
            $clientEnv = $clientEnv -replace "# VITE_API_URL=http://localhost:5000", "VITE_API_URL=http://localhost:5000/api"
            Set-Content -Path $clientEnvPath -Value $clientEnv -NoNewline
            Write-Host "[SUCCESS] Client configured to use backend API" -ForegroundColor Green
        }
    }
    else {
        Write-Host "[WARNING] Client API URL not found in .env" -ForegroundColor Yellow
        Write-Host "Add this line to client/career-findr/.env:" -ForegroundColor White
        Write-Host "VITE_API_URL=http://localhost:5000/api" -ForegroundColor Cyan
    }
}

# Test Firebase connection
Write-Host "`n[TEST] Testing Firebase configuration..." -ForegroundColor Cyan
try {
    $testScript = @"
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
};

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://career-findr-default-rtdb.firebaseio.com'
    });
    console.log('FIREBASE_OK');
} catch (error) {
    console.log('FIREBASE_ERROR: ' + error.message);
}
"@
    
    Set-Content -Path ".\test-firebase.mjs" -Value $testScript
    $result = node .\test-firebase.mjs 2>&1
    Remove-Item ".\test-firebase.mjs" -Force
    
    if ($result -match "FIREBASE_OK") {
        Write-Host "[SUCCESS] Firebase Admin SDK configured correctly!" -ForegroundColor Green
    }
    else {
        Write-Host "[WARNING] Firebase test failed: $result" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "[WARNING] Could not test Firebase connection" -ForegroundColor Yellow
}

# Summary
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   Configuration Complete!" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start the backend server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host "`n2. In a new terminal, start the client:" -ForegroundColor White
Write-Host "   cd client\career-findr" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host "`n3. Open your browser:" -ForegroundColor White
Write-Host "   Backend: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
