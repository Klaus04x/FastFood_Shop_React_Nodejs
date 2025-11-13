# Admin User Creation Script

## How to Create an Admin User

### Step 1: Configure Environment Variables
Add these variables to your `.env` file in the backend directory:

```env
# Required
MONGODB_URI=your_mongodb_connection_string

# Optional - if not provided, defaults will be used
ADMIN_EMAIL=admin@tomato.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=Administrator
```

### Step 2: Navigate to backend directory
```bash
cd backend
```

### Step 3: Run the script
```bash
npm run create-admin
```

### Step 4: Default Credentials (if not configured in .env)
- **Email**: `admin@tomato.com`
- **Password**: `admin123456`

### Step 5: Login
1. Go to admin panel: http://localhost:5174
2. Login with the credentials
3. **IMPORTANT**: Change the password immediately after first login!

## Customizing Admin Credentials

### Method 1: Using Environment Variables (Recommended)
Add to your `.env` file:

```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Name
```

### Method 2: Using Default Values
If environment variables are not set, the script will use default values:
- Email: `admin@tomato.com`
- Password: `admin123456`
- Name: `Administrator`

## Notes

- The script will check if an admin user already exists
- If a user with the email exists, it will be promoted to admin role
- Password must be at least 8 characters for the registration validation
- The script will automatically hash the password before storing it

## Troubleshooting

If you get connection errors:
1. Make sure MongoDB is running
2. Check your `.env` file has correct `MONGODB_URI`
3. Ensure the backend server is not running (to avoid port conflicts)
