# Hướng dẫn Deploy lên VPS Windows

## Thông tin Server
- **Domain**: nguyentienthanh.id.vn
- **VPS IP**: 47.129.6.216
- **OS**: Windows Server

## Yêu cầu trên VPS

### 1. Cài đặt phần mềm cần thiết
- Node.js (>= 16.x) - [Download](https://nodejs.org/)
- MongoDB hoặc MongoDB Atlas
- Git
- PM2 (để chạy Node.js như service): `npm install -g pm2`
- IIS hoặc Nginx cho Windows

### 2. Cấu hình Domain tại Nhân Hòa
1. Đăng nhập vào quản lý domain tại Nhân Hòa
2. Cấu hình DNS Records:
   ```
   A Record:
   @ (root)              -> 47.129.6.216
   www                   -> 47.129.6.216
   api                   -> 47.129.6.216
   admin                 -> 47.129.6.216
   ```
3. Chờ DNS propagate (5-30 phút)

## Bước 1: Chuẩn bị trên máy local

### 1.1. Cập nhật file .env cho backend
Tạo file `backend/.env.production`:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT & Session
JWT_SECRET=your_secure_jwt_secret_here
SESSION_SECRET=your_secure_session_secret_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://api.nguyentienthanh.id.vn/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://api.nguyentienthanh.id.vn/api/auth/github/callback

# Environment
NODE_ENV=production
PORT=4000
```

### 1.2. Tạo file .env cho Frontend
Tạo file `frontend/.env.production`:
```env
VITE_API_URL=https://api.nguyentienthanh.id.vn
```

### 1.3. Tạo file .env cho Admin
Tạo file `admin/.env.production`:
```env
VITE_API_URL=https://api.nguyentienthanh.id.vn
```

### 1.4. Build dự án trên local
```bash
# Build tất cả
npm run build

# Hoặc build từng phần
npm run build -w frontend
npm run build -w admin
npm run build -w backend
```

## Bước 2: Upload code lên VPS

### Cách 1: Dùng Git (Khuyến nghị)
Trên VPS, mở PowerShell:
```powershell
# Tạo thư mục project
cd C:\
mkdir websites
cd websites

# Clone project
git clone your_repository_url nnkb
cd nnkb

# Install dependencies
npm install --workspaces

# Copy file .env.production thành .env
copy backend\.env.production backend\.env
copy frontend\.env.production frontend\.env
copy admin\.env.production admin\.env

# Build project
npm run build
```

### Cách 2: Dùng FTP/SFTP
1. Sử dụng FileZilla hoặc WinSCP
2. Kết nối đến: `47.129.6.216`
3. Upload toàn bộ project vào: `C:\websites\nnkb`
4. Upload các file `.env.production` và rename thành `.env`

## Bước 3: Cài đặt MongoDB

### Tùy chọn A: MongoDB Atlas (Cloud - Khuyến nghị)
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo free cluster
3. Tạo database user
4. Whitelist IP: `47.129.6.216` hoặc `0.0.0.0/0` (all IPs)
5. Lấy connection string và update vào `backend/.env`

### Tùy chọn B: MongoDB trên VPS
1. Download [MongoDB Community Server for Windows](https://www.mongodb.com/try/download/community)
2. Cài đặt với default settings
3. Khởi động MongoDB service
4. Connection string: `mongodb://localhost:27017/nnkb`

## Bước 4: Chạy Backend với PM2

Trên VPS PowerShell:
```powershell
cd C:\websites\nnkb\backend

# Install PM2 globally nếu chưa có
npm install -g pm2
npm install -g pm2-windows-startup

# Setup PM2 startup
pm2-startup install

# Start backend
pm2 start server.js --name nnkb-backend

# Save PM2 process list
pm2 save

# Kiểm tra
pm2 list
pm2 logs nnkb-backend
```

## Bước 5: Cấu hình IIS (Internet Information Services)

### 5.1. Enable IIS
1. Mở Server Manager
2. Add Roles and Features
3. Chọn Web Server (IIS)
4. Install

### 5.2. Install URL Rewrite Module
1. Download [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Cài đặt

### 5.3. Tạo websites trong IIS

#### Site 1: Frontend (nguyentienthanh.id.vn)
1. Mở IIS Manager
2. Right-click "Sites" → "Add Website"
   - Site name: `nnkb-frontend`
   - Physical path: `C:\websites\nnkb\frontend\dist`
   - Binding:
     - Type: http
     - IP: All Unassigned
     - Port: 80
     - Host name: `nguyentienthanh.id.vn`
3. Thêm binding cho www:
   - Type: http
   - Port: 80
   - Host name: `www.nguyentienthanh.id.vn`

#### Site 2: Admin (admin.nguyentienthanh.id.vn)
1. Add Website
   - Site name: `nnkb-admin`
   - Physical path: `C:\websites\nnkb\admin\dist`
   - Binding:
     - Type: http
     - Port: 80
     - Host name: `admin.nguyentienthanh.id.vn`

#### Site 3: API Backend (api.nguyentienthanh.id.vn)
1. Add Website
   - Site name: `nnkb-api`
   - Physical path: `C:\websites\nnkb\backend`
   - Binding:
     - Type: http
     - Port: 80
     - Host name: `api.nguyentienthanh.id.vn`

### 5.4. Cấu hình URL Rewrite cho API

Tạo file `C:\websites\nnkb\backend\web.config`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxyInboundRule1" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:4000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### 5.5. Cấu hình URL Rewrite cho Frontend & Admin (SPA)

Tạo file `C:\websites\nnkb\frontend\dist\web.config`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

Copy tương tự cho Admin:
```powershell
copy C:\websites\nnkb\frontend\dist\web.config C:\websites\nnkb\admin\dist\web.config
```

## Bước 6: Cấu hình SSL/HTTPS (Tùy chọn nhưng khuyến nghị)

### Sử dụng Let's Encrypt (Miễn phí)
1. Download [Win-ACME](https://www.win-acme.com/)
2. Chạy `wacs.exe`
3. Chọn tùy chọn tạo certificate cho IIS sites
4. Chọn tất cả các sites (frontend, admin, api)
5. Win-ACME sẽ tự động cấu hình SSL

## Bước 7: Cấu hình Firewall

Mở PowerShell với quyền Administrator:
```powershell
# Mở port 80 (HTTP)
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

# Mở port 443 (HTTPS)
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow

# Mở port 4000 (Backend - chỉ local)
New-NetFirewallRule -DisplayName "Node Backend" -Direction Inbound -Protocol TCP -LocalPort 4000 -RemoteAddress LocalSubnet -Action Allow
```

## Bước 8: Cập nhật OAuth Callbacks

### Google OAuth
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Vào Credentials → OAuth 2.0 Client IDs
3. Thêm Authorized redirect URIs:
   - `https://api.nguyentienthanh.id.vn/api/auth/google/callback`

### GitHub OAuth
1. Truy cập [GitHub Developer Settings](https://github.com/settings/developers)
2. Chọn OAuth App của bạn
3. Cập nhật Authorization callback URL:
   - `https://api.nguyentienthanh.id.vn/api/auth/github/callback`

## Bước 9: Kiểm tra và Test

### 9.1. Kiểm tra Backend
```powershell
# Kiểm tra PM2
pm2 status
pm2 logs nnkb-backend

# Test API
curl http://localhost:4000/api/food
curl https://api.nguyentienthanh.id.vn/api/food
```

### 9.2. Kiểm tra Frontend
Truy cập: `https://nguyentienthanh.id.vn`

### 9.3. Kiểm tra Admin
Truy cập: `https://admin.nguyentienthanh.id.vn`

## Bước 10: Bảo trì và Quản lý

### PM2 Commands
```powershell
# Xem logs
pm2 logs nnkb-backend

# Restart
pm2 restart nnkb-backend

# Stop
pm2 stop nnkb-backend

# Xem status
pm2 status

# Monitoring
pm2 monit
```

### Update Code
```powershell
cd C:\websites\nnkb

# Pull latest code
git pull

# Install new dependencies
npm install --workspaces

# Rebuild
npm run build

# Restart backend
pm2 restart nnkb-backend

# Không cần restart IIS vì nó serve static files
```

## Khắc phục sự cố

### Backend không chạy
```powershell
# Kiểm tra port 4000
netstat -ano | findstr :4000

# Kiểm tra logs
pm2 logs nnkb-backend --lines 100

# Restart
pm2 restart nnkb-backend
```

### Frontend/Admin không load
1. Kiểm tra IIS site có running không
2. Kiểm tra file `web.config` có đúng không
3. Kiểm tra permissions của folder `dist`

### Database connection error
1. Kiểm tra MongoDB service đang chạy
2. Kiểm tra connection string trong `backend/.env`
3. Kiểm tra firewall/security group

### CORS Error
1. Kiểm tra CORS config trong [backend/server.js:24-27](backend/server.js#L24-L27)
2. Thêm domain production vào allowed origins:
```javascript
cors({
    origin: [
        'https://nguyentienthanh.id.vn',
        'https://www.nguyentienthanh.id.vn',
        'https://admin.nguyentienthanh.id.vn'
    ],
    credentials: true
})
```

## Checklist Hoàn thành

- [ ] Cài đặt Node.js, Git, PM2 trên VPS
- [ ] Cài đặt MongoDB (Atlas hoặc local)
- [ ] Cấu hình DNS tại Nhân Hòa
- [ ] Upload code lên VPS
- [ ] Tạo và cấu hình file .env cho production
- [ ] Build frontend và admin
- [ ] Chạy backend với PM2
- [ ] Cài đặt và cấu hình IIS
- [ ] Tạo 3 websites trong IIS (frontend, admin, api)
- [ ] Cấu hình URL Rewrite
- [ ] Cấu hình SSL/HTTPS
- [ ] Cấu hình Firewall
- [ ] Cập nhật OAuth callbacks
- [ ] Test tất cả các services

## Liên hệ hỗ trợ
Nếu gặp vấn đề, hãy kiểm tra:
1. PM2 logs: `pm2 logs`
2. IIS logs: `C:\inetpub\logs\LogFiles\`
3. MongoDB logs (nếu local): `C:\Program Files\MongoDB\Server\{version}\log\`
