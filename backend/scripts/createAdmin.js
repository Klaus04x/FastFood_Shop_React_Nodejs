import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error('❌ Error: MONGODB_URI is not defined in .env file');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@tomato.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'; // Min 8 characters
        const adminName = process.env.ADMIN_NAME || 'Administrator';

        // Validate password length
        if (adminPassword.length < 8) {
            console.error('❌ Error: Admin password must be at least 8 characters long');
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists with email:', adminEmail);

            // Update to admin role if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated existing user to admin role');
            }

            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin user
        const admin = new userModel({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');
        console.log('🌐 Login at: http://localhost:5174');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
