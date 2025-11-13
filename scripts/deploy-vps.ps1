# PowerShell script để deploy trên VPS Windows
# Chạy script này trên VPS sau khi đã upload code

param(
    [string]$ProjectPath = "C:\websites\nnkb",
    [switch]$SkipBuild = $false,
    [switch]$RestartOnly = $false
)

Write-Host "🚀 NNKB Deployment Script for Windows VPS" -ForegroundColor Green
Write-Host "==========================================`n" -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Warning: Not running as Administrator. Some operations may fail." -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator for full functionality.`n" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Change to project directory
Set-Location $ProjectPath

if ($RestartOnly) {
    Write-Host "🔄 Restarting backend only..." -ForegroundColor Yellow
    pm2 restart nnkb-backend
    pm2 logs nnkb-backend --lines 20
    exit
}

# Check if .env files exist
Write-Host "🔍 Checking environment files..." -ForegroundColor Cyan
$envFiles = @(
    "backend\.env",
    "frontend\.env",
    "admin\.env"
)

$missingEnvFiles = @()
foreach ($file in $envFiles) {
    if (-not (Test-Path $file)) {
        $missingEnvFiles += $file
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    } else {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    }
}

if ($missingEnvFiles.Count -gt 0) {
    Write-Host "`n⚠️  Missing environment files!" -ForegroundColor Red
    Write-Host "Please copy .env.production files to .env:" -ForegroundColor Yellow
    foreach ($file in $missingEnvFiles) {
        $prodFile = $file.Replace(".env", ".env.production")
        Write-Host "  copy $prodFile $file" -ForegroundColor Yellow
    }
    $continue = Read-Host "`nContinue without these files? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install --workspaces

if (-not $SkipBuild) {
    # Build frontend and admin
    Write-Host "`n🎨 Building Frontend..." -ForegroundColor Cyan
    Set-Location "frontend"
    npm run build

    # Copy web.config to dist
    if (Test-Path "web.config.template") {
        Copy-Item "web.config.template" "dist\web.config" -Force
        Write-Host "✅ Copied web.config to frontend\dist" -ForegroundColor Green
    }
    Set-Location $ProjectPath

    Write-Host "`n🔧 Building Admin..." -ForegroundColor Cyan
    Set-Location "admin"
    npm run build

    # Copy web.config to dist
    if (Test-Path "web.config.template") {
        Copy-Item "web.config.template" "dist\web.config" -Force
        Write-Host "✅ Copied web.config to admin\dist" -ForegroundColor Green
    }
    Set-Location $ProjectPath
}

# Create uploads directory
$uploadsDir = "backend\uploads"
if (-not (Test-Path $uploadsDir)) {
    New-Item -ItemType Directory -Path $uploadsDir -Force | Out-Null
    Write-Host "✅ Created uploads directory" -ForegroundColor Green
}

# Check if PM2 is installed
Write-Host "`n🔍 Checking PM2..." -ForegroundColor Cyan
try {
    $pm2Version = pm2 --version
    Write-Host "✅ PM2 version: $pm2Version" -ForegroundColor Green
} catch {
    Write-Host "❌ PM2 not found. Installing PM2..." -ForegroundColor Red
    npm install -g pm2
    npm install -g pm2-windows-startup
    Write-Host "⚙️  Setting up PM2 startup..." -ForegroundColor Yellow
    pm2-startup install
}

# Stop existing PM2 process if running
Write-Host "`n🛑 Stopping existing backend process..." -ForegroundColor Cyan
pm2 stop nnkb-backend 2>$null
pm2 delete nnkb-backend 2>$null

# Start backend with PM2
Write-Host "`n🚀 Starting backend with PM2..." -ForegroundColor Cyan
Set-Location "backend"
pm2 start server.js --name nnkb-backend
pm2 save
Set-Location $ProjectPath

# Show PM2 status
Write-Host "`n📊 PM2 Status:" -ForegroundColor Cyan
pm2 list

Write-Host "`n✨ Deployment completed!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure IIS websites (see DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host "2. Test the API: http://localhost:4000" -ForegroundColor White
Write-Host "3. Check PM2 logs: pm2 logs nnkb-backend" -ForegroundColor White
Write-Host "4. Monitor PM2: pm2 monit" -ForegroundColor White

Write-Host "`n🌐 Expected URLs after IIS configuration:" -ForegroundColor Cyan
Write-Host "  Frontend: https://nguyentienthanh.id.vn" -ForegroundColor White
Write-Host "  Admin:    https://admin.nguyentienthanh.id.vn" -ForegroundColor White
Write-Host "  API:      https://api.nguyentienthanh.id.vn" -ForegroundColor White

# Show logs
Write-Host "`n📋 Recent logs:" -ForegroundColor Cyan
pm2 logs nnkb-backend --lines 20 --nostream
