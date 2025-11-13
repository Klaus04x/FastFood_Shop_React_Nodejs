import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.json({ success: false, message: "Unauthorized access. Admin only" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token, name: user.name });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Verify admin token
const verifyAdmin = async (req, res) => {
    try {
        const userId = req.body.userId; // From auth middleware
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.json({ success: false, message: "Not an admin" });
        }

        res.json({ success: true, admin: { name: user.name, email: user.email } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { loginAdmin, verifyAdmin };
