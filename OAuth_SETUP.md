# OAuth Setup Guide - Single Sign-On (SSO)

Hướng dẫn cấu hình đăng nhập bằng Google và GitHub OAuth2.

## 1. Google OAuth Setup

### Bước 1: Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Chọn **Application type**: Web application
6. Cấu hình:
   - **Name**: FastFood Shop (hoặc tên bất kỳ)
   - **Authorized JavaScript origins**:
     - `http://localhost:4000`
   - **Authorized redirect URIs**:
     - `http://localhost:4000/api/auth/google/callback`
7. Click **Create** và copy **Client ID** và **Client Secret**

### Bước 2: Cập nhật file .env

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

## 2. GitHub OAuth Setup

### Bước 1: Tạo GitHub OAuth App

1. Truy cập [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** > **New OAuth App**
3. Điền thông tin:
   - **Application name**: FastFood Shop (hoặc tên bất kỳ)
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:4000/api/auth/github/callback`
4. Click **Register application**
5. Copy **Client ID**
6. Click **Generate a new client secret** và copy **Client Secret**

### Bước 2: Cập nhật file .env

```env
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:4000/api/auth/github/callback
```

## 3. Cài đặt Dependencies

Đảm bảo các package sau đã được cài đặt trong backend:

```bash
cd backend
npm install passport passport-google-oauth20 passport-github2 express-session
```

## 4. Khởi động Server

```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin (optional)
cd admin
npm run dev
```

## 5. Test OAuth Login

1. Truy cập `http://localhost:5173/login`
2. Click vào nút **Google** hoặc **GitHub**
3. Đăng nhập bằng tài khoản Google/GitHub
4. Sau khi đăng nhập thành công, bạn sẽ được redirect về trang chủ

## 6. Cách hoạt động

### Flow đăng nhập OAuth:

1. User click nút "Login with Google/GitHub" trên frontend
2. Frontend redirect user đến backend OAuth endpoint (`/api/auth/google` hoặc `/api/auth/github`)
3. Backend redirect user đến trang đăng nhập của Google/GitHub
4. User đăng nhập và cho phép ứng dụng truy cập thông tin
5. Google/GitHub redirect về backend callback URL với authorization code
6. Backend xử lý callback:
   - Lấy thông tin user từ Google/GitHub
   - Tìm hoặc tạo user trong database
   - Tạo JWT token
7. Backend redirect về frontend với token
8. Frontend lưu token và redirect user về trang chủ

## 7. Database Schema

User model đã được cập nhật để hỗ trợ OAuth:

```javascript
{
  name: String,
  email: String,
  password: String,
  provider: String, // 'local', 'google', 'github'
  googleId: String,
  githubId: String,
  cartData: Object
}
```

## 8. Security Notes

- **HTTPS**: Trong production, phải sử dụng HTTPS cho tất cả OAuth URLs
- **Callback URLs**: Đảm bảo callback URLs được cấu hình chính xác trong OAuth apps
- **Secrets**: Không commit file .env vào Git. Sử dụng .env.example làm template
- **Session Secret**: Sử dụng session secret mạnh và khác nhau cho mỗi environment

## 9. Production Deployment

Khi deploy lên production:

1. Cập nhật Authorized redirect URIs trong Google/GitHub OAuth apps:
   - Google: `https://yourdomain.com/api/auth/google/callback`
   - GitHub: `https://yourdomain.com/api/auth/github/callback`

2. Cập nhật file .env trong production:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   GITHUB_CALLBACK_URL=https://yourdomain.com/api/auth/github/callback
   FRONTEND_URL=https://yourdomain.com
   ```

3. Enable HTTPS và cập nhật session cookie:
   ```javascript
   cookie: { secure: true } // Trong server.js
   ```

## 10. Troubleshooting

### Lỗi "redirect_uri_mismatch"
- Kiểm tra lại callback URL trong OAuth app settings
- Đảm bảo callback URL trong .env khớp với OAuth app

### Lỗi "invalid_client"
- Kiểm tra lại Client ID và Client Secret
- Đảm bảo không có khoảng trắng thừa trong .env

### User không được tạo trong database
- Kiểm tra MongoDB connection
- Xem logs trong terminal backend
- Đảm bảo user model đã được cập nhật với các trường OAuth

## 11. API Endpoints

### OAuth Endpoints:

- **GET** `/api/auth/google` - Initiate Google OAuth flow
- **GET** `/api/auth/google/callback` - Google OAuth callback
- **GET** `/api/auth/github` - Initiate GitHub OAuth flow
- **GET** `/api/auth/github/callback` - GitHub OAuth callback

### Frontend Routes:

- `/login` - Login page with OAuth buttons
- `/auth/callback` - OAuth callback handler page

## Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Console logs trong browser (F12)
2. Terminal logs của backend server
3. OAuth app configuration trong Google/GitHub
4. File .env có đầy đủ credentials
