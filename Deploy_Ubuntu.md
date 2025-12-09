# Hướng dẫn Deploy lên VPS Ubuntu (Khuyến nghị)

## Thông tin Server
- **Domain**: nguyentienthanh.id.vn
- **VPS IP Public**: 47.129.62.248
- **VPS IP Private**: 172.31.0.158
- **OS**: Ubuntu 20.04 hoặc 22.04 LTS

---

## PHẦN 1: CHUẨN BỊ VPS UBUNTU

### 1.1. Tạo VPS Ubuntu trên AWS

#### Option A: Reinstall VPS hiện tại (nếu được)
1. Vào AWS EC2 Console
2. Chọn instance hiện tại
3. Actions → Image and templates → Launch more like this
4. Chọn AMI: **Ubuntu Server 22.04 LTS**
5. Hoặc terminate instance cũ và tạo mới

#### Option B: Tạo VPS Ubuntu mới
1. Vào AWS EC2 Console → Launch Instance
2. **Name**: FastFood-Ubuntu
3. **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
4. **Instance type**: t2.micro (hoặc t2.small nếu cần performance cao hơn)
5. **Key pair**: Tạo mới hoặc dùng có sẵn (để SSH)
6. **Network Settings**:
   - Allow SSH (port 22)
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
7. **Storage**: 20GB
8. Launch Instance

#### Lấy IP và SSH Key
- IP Public: **47.129.62.248** ✅
- IP Private: 172.31.0.158
- Download file `.pem` key để SSH

### 1.2. Cấu hình Security Group

Đảm bảo Security Group có các rules:

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP hoặc 0.0.0.0/0 | SSH Access |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS |
| Custom TCP | TCP | 4000 | 127.0.0.1/32 | Backend (local only) |

### 1.3. Cấu hình DNS tại Nhân Hòa

Truy cập quản lý DNS tại Nhân Hòa và tạo 4 A Records trỏ về IP Public mới:

```
@ (root)    →  47.129.62.248
www         →  47.129.62.248
api         →  47.129.62.248
admin       →  47.129.62.248
```

**LƯU Ý**: Sử dụng IP Public (47.129.62.248), KHÔNG dùng IP Private!

---

## PHẦN 2: KẾT NỐI VÀ CÀI ĐẶT CƠ BẢN

### 2.1. Kết nối SSH vào VPS

#### Trên Windows (dùng PowerShell hoặc PuTTY):

**Cách 1: PowerShell**
```powershell
# Di chuyển đến thư mục chứa file .pem
cd C:\path\to\key

# Set permissions (chỉ cần lần đầu)
icacls "keyubuntu.pem" /inheritance:r
icacls "keyubuntu.pem" /grant:r "%username%:R"

# SSH vào VPS
ssh -i "keyubuntu.pem" ubuntu@47.129.62.248
```

**Cách 2: PuTTY**
1. Download PuTTY và PuTTYgen
2. Dùng PuTTYgen convert file `.pem` thành `.ppk`
3. Mở PuTTY, nhập IP, load `.ppk` file
4. Username: `ubuntu`

### 2.2. Update hệ thống

```bash
# Sau khi SSH vào VPS, chạy:
sudo apt update
sudo apt upgrade -y
```

### 2.3. Cài đặt Node.js 20.x

```bash
# Cài Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra version
node --version  # Phải >= v20.x
npm --version   # Phải >= 10.x
```

### 2.4. Cài đặt Nginx

```bash
# Cài Nginx
sudo apt install -y nginx

# Start và enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Kiểm tra status
sudo systemctl status nginx

# Test: Mở trình duyệt và truy cập http://YOUR_IP
# Phải thấy trang "Welcome to nginx!"
```

### 2.5. Cài đặt PM2

```bash
# Cài PM2 globally
sudo npm install -g pm2

# Kiểm tra
pm2 --version
```

### 2.6. Cài đặt Git

```bash
# Cài Git (nếu chưa có)
sudo apt install -y git

# Cấu hình Git (optional)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## PHẦN 3: UPLOAD VÀ BUILD DỰ ÁN

### 3.1. Tạo thư mục project

```bash
# Tạo thư mục cho web projects
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

# Di chuyển vào thư mục
cd /var/www
```

### 3.2. Upload code lên VPS


```bash
# Clone repository
git clone https://github.com/Klaus04x/FastFood_Shop_React_Nodejs fastfood
cd fastfood

# Hoặc nếu repo private, cần authenticate
```


### 3.3. Cấu hình file .env

```bash
# Di chuyển vào thư mục project
cd /var/www/fastfood

# Copy file .env cho backend
cp backend/.env.production backend/.env

# Chỉnh sửa file .env
nano backend/.env
```

**Nội dung file `backend/.env`:**
```env
# MongoDB Connection - MongoDB Atlas
MONGODB_URI=mongodb+srv://huyenmoi13aa:goku13aa@cluster0.z3i4sgh.mongodb.net/food-del?retryWrites=true&w=majority

# JWT & Session Secrets (Thay đổi thành giá trị ngẫu nhiên mạnh)
JWT_SECRET=your_random_secure_jwt_secret_here_12345
SESSION_SECRET=your_random_secure_session_secret_here_67890

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51SNFeP69gk7XG2jbwNZNRwgsfYVPJFfyogKloi3Fi2PqN8HmkmdvmgmXynMTZZX0u62iGlqUJakmbyWeHbCHbPGy009YoeEyxe

# Google OAuth
GOOGLE_CLIENT_ID=174612027066-ourcm59ph8l1731q1f7u1vc7j76lb1o9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://api.nguyentienthanh.id.vn/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liK2xsAEHSN53gFK
GITHUB_CLIENT_SECRET=9e4a507a18124071597ba66e9db879823bc94eb6
GITHUB_CALLBACK_URL=https://api.nguyentienthanh.id.vn/api/auth/github/callback

# Environment
NODE_ENV=production
PORT=4000
```

**Lưu file**: Ctrl+X, Y, Enter

```bash
# Copy file .env cho frontend
cp frontend/.env.production frontend/.env

# Copy file .env cho admin
cp admin/.env.production admin/.env
```

### 3.4. Install dependencies và Build

```bash
# Vẫn ở trong /var/www/fastfood

# Install dependencies cho tất cả workspaces
npm install --workspaces

# Build frontend và admin

npm run build -w frontend
npm run build -w admin

# Tạo thư mục uploads cho backend
mkdir -p backend/uploads

### 3.5. Tự động hoá deploy (tùy chọn)

Trong repo có sẵn script `deploy.sh` để tự động pull code, build frontend/admin, cài dependency và restart backend + reload Nginx. Bạn có thể chạy script này trên VPS từ thư mục `/var/www/fastfood`:

```bash
# Đảm bảo file có quyền thực thi
chmod +x deploy.sh

# Chạy (mặc định deploy branch master):
./deploy.sh /var/www/fastfood master

# Nếu muốn thay tên process pm2, export PM2_NAME trước khi gọi:
export PM2_NAME=fastfood-backend
./deploy.sh /var/www/fastfood master
```

Script sẽ tạo backup tạm thời của `uploads` và `.env` vào `/tmp`, build các frontend, restart pm2 và reload nginx.
```

---

## PHẦN 4: CHẠY BACKEND VỚI PM2

### 4.1. Start Backend

```bash
# Di chuyển vào thư mục backend
cd /var/www/fastfood/backend

# Install dependencies (nếu chưa)
npm install

# Start với PM2
pm2 start server.js --name fastfood-backend

# Xem logs
pm2 logs fastfood-backend

# Kiểm tra status
pm2 status
```

### 4.2. Cấu hình PM2 auto-start khi reboot

```bash
# Generate startup script
pm2 startup

# Copy và chạy lệnh mà PM2 hiển thị (dạng sudo...)
# Ví dụ: sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save PM2 process list
pm2 save
```

### 4.3. Test Backend

```bash
# Test backend
curl http://localhost:4000

# Phải thấy response: "API Working"
```

---

## PHẦN 5: CẤU HÌNH NGINX

### 5.1. Tạo file cấu hình Nginx

```bash
# Tạo file config
sudo nano /etc/nginx/sites-available/fastfood
```

**Nội dung file:**
```nginx
# Frontend - nguyentienthanh.id.vn
server {
    listen 80;
    listen [::]:80;
    server_name nguyentienthanh.id.vn www.nguyentienthanh.id.vn;

    root /var/www/fastfood/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Admin - admin.nguyentienthanh.id.vn
server {
    listen 80;
    listen [::]:80;
    server_name admin.nguyentienthanh.id.vn;

    root /var/www/fastfood/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# API - api.nguyentienthanh.id.vn
server {
    listen 80;
    listen [::]:80;
    server_name api.nguyentienthanh.id.vn;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Lưu file**: Ctrl+X, Y, Enter

### 5.2. Enable site

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/fastfood /etc/nginx/sites-enabled/

# Xóa default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Nếu OK, reload Nginx
sudo systemctl reload nginx
```

---

## PHẦN 6: CÀI ĐẶT SSL (HTTPS)

### 6.1. Cài đặt Certbot

```bash
# Cài Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2. Lấy SSL certificate miễn phí

```bash
# Chạy Certbot cho tất cả domains
sudo certbot --nginx -d nguyentienthanh.id.vn -d www.nguyentienthanh.id.vn -d admin.nguyentienthanh.id.vn -d api.nguyentienthanh.id.vn

# Nhập email khi được hỏi
# Đồng ý Terms of Service: Y
# Share email: N (hoặc Y nếu muốn)
# Chọn option 2: Redirect HTTP to HTTPS
```

Certbot sẽ tự động:
- Tạo SSL certificate
- Cập nhật Nginx config
- Setup auto-renewal

### 6.3. Kiểm tra auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Nếu OK, certificate sẽ tự động renew mỗi 60 ngày
```

---

## PHẦN 7: CẤU HÌNH FIREWALL (UFW)

### 7.1. Enable UFW

```bash
# Allow SSH (QUAN TRỌNG - làm trước khi enable UFW)
sudo ufw allow OpenSSH

# Allow HTTP và HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Kiểm tra status
sudo ufw status
```

Kết quả:
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
```

---

## PHẦN 8: CẬP NHẬT OAUTH CALLBACKS

### 8.1. Google OAuth Console

1. Truy cập: https://console.cloud.google.com/
2. Vào **Credentials** → OAuth 2.0 Client IDs
3. Click vào Client ID của bạn
4. **Authorized redirect URIs** → Add:
   ```
   https://api.nguyentienthanh.id.vn/api/auth/google/callback
   ```
5. **Save**

### 8.2. GitHub OAuth Settings

1. Truy cập: https://github.com/settings/developers
2. Click vào OAuth App của bạn
3. **Authorization callback URL**:
   ```
   https://api.nguyentienthanh.id.vn/api/auth/github/callback
   ```
4. **Update application**

---

## PHẦN 9: KIỂM TRA VÀ TEST

### 9.1. Kiểm tra tất cả services

```bash
# Kiểm tra PM2
pm2 status
pm2 logs fastfood-backend --lines 50

# Kiểm tra Nginx
sudo systemctl status nginx
sudo nginx -t

# Kiểm tra các port
sudo netstat -tlnp | grep -E ':80|:443|:4000'
```

### 9.2. Test từng website

Mở trình duyệt và test:

1. **Frontend**: https://nguyentienthanh.id.vn
2. **Admin**: https://admin.nguyentienthanh.id.vn
3. **API**: https://api.nguyentienthanh.id.vn

### 9.3. Test API endpoints

```bash
# Test API health
curl https://api.nguyentienthanh.id.vn

# Phải thấy: "API Working"

# Test food endpoint
curl https://api.nguyentienthanh.id.vn/api/food
```

---

## PHẦN 10: BẢO TRÌ VÀ CẬP NHẬT

### 10.1. Các lệnh PM2 hữu ích

```bash
# Xem logs
pm2 logs fastfood-backend

# Xem logs realtime với filter
pm2 logs fastfood-backend --lines 100

# Restart backend
pm2 restart fastfood-backend

# Stop backend
pm2 stop fastfood-backend

# Xem monitoring
pm2 monit

# Xem thông tin chi tiết
pm2 show fastfood-backend
```

### 10.2. Update code

```bash
# SSH vào VPS
ssh -i "keyubuntu.pem" ubuntu@47.129.62.248

# Di chuyển vào thư mục project
cd /var/www/fastfood

# Pull latest code
git pull

# Install new dependencies (nếu có)
npm install --workspaces

# Rebuild frontend và admin
npm run build -w frontend
npm run build -w admin

# Restart backend
pm2 restart fastfood-backend

# Clear Nginx cache (nếu cần)
sudo systemctl reload nginx
```

### 10.3. Backup

```bash
# Backup database (nếu dùng local MongoDB)
# Với MongoDB Atlas, backup tự động

# Backup uploads folder
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/fastfood/backend/uploads

# Backup .env files
tar -czf env-backup-$(date +%Y%m%d).tar.gz /var/www/fastfood/backend/.env /var/www/fastfood/frontend/.env /var/www/fastfood/admin/.env
```

---

## PHẦN 11: KHẮC PHỤC SỰ CỐ

### 11.1. Backend không chạy

```bash
# Kiểm tra PM2 logs
pm2 logs fastfood-backend --err

# Kiểm tra MongoDB connection
# Xem log có lỗi "MongooseError" không

# Restart backend
pm2 restart fastfood-backend

# Nếu vẫn lỗi, chạy trực tiếp để debug
cd /var/www/fastfood/backend
node server.js
```

### 11.2. Frontend/Admin không load

```bash
# Kiểm tra Nginx error log
sudo tail -f /var/log/nginx/error.log

# Kiểm tra Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Kiểm tra file có tồn tại
ls -la /var/www/fastfood/frontend/dist
ls -la /var/www/fastfood/admin/dist
```

### 11.3. SSL không hoạt động

```bash
# Kiểm tra certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Reload Nginx
sudo systemctl reload nginx
```

### 11.4. CORS Error

Nếu frontend không kết nối được API:

```bash
# Kiểm tra backend logs
pm2 logs fastfood-backend

# Kiểm tra CORS config trong backend/server.js
# Đảm bảo allowedOrigins có domain production
```

### 11.5. Port 4000 bị chiếm

```bash
# Tìm process đang dùng port 4000
sudo lsof -i :4000

# Kill process (thay PID)
sudo kill -9 <PID>

# Hoặc dùng PM2
pm2 delete all
pm2 start /var/www/fastfood/backend/server.js --name fastfood-backend
```

---

## PHẦN 12: TỐI ỨU HIỆU SUẤT

### 12.1. Enable Gzip compression trong Nginx

```bash
sudo nano /etc/nginx/nginx.conf
```

Thêm vào trong `http {}` block:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

Reload Nginx:
```bash
sudo systemctl reload nginx
```

### 12.2. PM2 Cluster Mode (nếu cần)

```bash
# Stop current process
pm2 delete fastfood-backend

# Start với cluster mode (sử dụng tất cả CPU cores)
pm2 start /var/www/fastfood/backend/server.js --name fastfood-backend -i max

# Save
pm2 save
```

### 12.3. Monitor với PM2 Plus (Optional)

```bash
# Đăng ký tại: https://pm2.io/
# Link PM2 với cloud monitoring
pm2 link <secret_key> <public_key>
```

---

## Checklist Hoàn thành

- [ ] Tạo VPS Ubuntu trên AWS
- [ ] Cấu hình Security Group (SSH, HTTP, HTTPS)
- [ ] Cấu hình DNS A Records tại Nhân Hòa
- [ ] SSH vào VPS
- [ ] Cài Node.js, Nginx, PM2, Git
- [ ] Upload code lên VPS
- [ ] Tạo file .env cho backend, frontend, admin
- [ ] Build frontend và admin
- [ ] Start backend với PM2
- [ ] Cấu hình PM2 auto-start
- [ ] Cấu hình Nginx cho 3 sites
- [ ] Cài SSL với Certbot
- [ ] Cấu hình UFW firewall
- [ ] Cập nhật Google OAuth callback
- [ ] Cập nhật GitHub OAuth callback
- [ ] Test tất cả websites
- [ ] Kiểm tra logs và monitoring

---

## Liên hệ & Hỗ trợ

### Các file log quan trọng:
- **PM2 logs**: `pm2 logs`
- **Nginx access**: `/var/log/nginx/access.log`
- **Nginx error**: `/var/log/nginx/error.log`
- **System**: `sudo journalctl -u nginx`

### Commands hữu ích:
```bash
# Restart tất cả services
pm2 restart all
sudo systemctl restart nginx

# Xem resource usage
htop
pm2 monit

# Xem disk space
df -h

# Xem memory
free -h
```

---

## So sánh với Windows

| Tính năng | Ubuntu | Windows Server |
|-----------|--------|----------------|
| Thời gian setup | 20-30 phút | 1-2 giờ |
| Commands | ~20 lệnh | ~50+ bước |
| Stability | Rất ổn định | Hay lỗi IIS |
| RAM usage | ~500MB | ~2GB+ |
| Chi phí | Rẻ hơn | Đắt hơn |

**Kết luận**: Ubuntu đơn giản và hiệu quả hơn rất nhiều!

---

**Chúc bạn deploy thành công!** 🚀

Nếu gặp vấn đề, hãy kiểm tra logs và tham khảo phần Khắc phục sự cố.
