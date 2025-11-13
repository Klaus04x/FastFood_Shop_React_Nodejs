# Quick Start - Deploy lên VPS Windows

## Tóm tắt các bước chính

### 1. Chuẩn bị trên máy local

```bash
# Build production
npm run build:production
```

### 2. Upload lên VPS (chọn 1 trong 2 cách)

**Cách 1: Git (Khuyến nghị)**
```powershell
# Trên VPS
cd C:\websites
git clone your_repo_url nnkb
cd nnkb
```

**Cách 2: FTP/WinSCP**
- Upload toàn bộ folder lên `C:\websites\nnkb`

### 3. Cấu hình DNS tại Nhân Hòa

Thêm các DNS Records:
```
A Record:  @       → 47.129.6.216
A Record:  www     → 47.129.6.216
A Record:  api     → 47.129.6.216
A Record:  admin   → 47.129.6.216
```

### 4. Cấu hình trên VPS

```powershell
# Chạy PowerShell as Administrator
cd C:\websites\nnkb

# Copy file .env
copy backend\.env.production backend\.env
copy frontend\.env.production frontend\.env
copy admin\.env.production admin\.env

# Sửa backend\.env: Cập nhật MongoDB connection string và secrets

# Chạy deployment script
.\scripts\deploy-vps.ps1
```

### 5. Cấu hình IIS

1. Cài URL Rewrite Module: https://www.iis.net/downloads/microsoft/url-rewrite

2. Tạo 3 websites trong IIS:

**Frontend:**
- Physical path: `C:\websites\nnkb\frontend\dist`
- Binding: `nguyentienthanh.id.vn` (port 80)
- Binding: `www.nguyentienthanh.id.vn` (port 80)

**Admin:**
- Physical path: `C:\websites\nnkb\admin\dist`
- Binding: `admin.nguyentienthanh.id.vn` (port 80)

**API:**
- Physical path: `C:\websites\nnkb\backend`
- Binding: `api.nguyentienthanh.id.vn` (port 80)

### 6. Cài SSL (Khuyến nghị)

```powershell
# Download Win-ACME
# https://www.win-acme.com/

# Chạy wacs.exe và làm theo hướng dẫn
```

### 7. Cập nhật OAuth Callbacks

**Google OAuth Console:**
- Thêm: `https://api.nguyentienthanh.id.vn/api/auth/google/callback`

**GitHub OAuth Settings:**
- Thêm: `https://api.nguyentienthanh.id.vn/api/auth/github/callback`

### 8. Test

```powershell
# Test backend
curl http://localhost:4000

# Kiểm tra PM2
pm2 list
pm2 logs nnkb-backend
```

Truy cập:
- Frontend: https://nguyentienthanh.id.vn
- Admin: https://admin.nguyentienthanh.id.vn
- API: https://api.nguyentienthanh.id.vn

---

## Các lệnh hữu ích

```powershell
# PM2 commands
pm2 list                    # Xem danh sách processes
pm2 logs nnkb-backend       # Xem logs
pm2 restart nnkb-backend    # Restart backend
pm2 stop nnkb-backend       # Stop backend
pm2 monit                   # Monitor realtime

# Update code
cd C:\websites\nnkb
git pull
npm install --workspaces
npm run build:production
pm2 restart nnkb-backend

# Restart deployment script
.\scripts\deploy-vps.ps1 -RestartOnly
```

---

Xem hướng dẫn chi tiết trong [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
