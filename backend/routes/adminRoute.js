import express from "express";
import { loginAdmin, verifyAdmin } from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/verify", authMiddleware, verifyAdmin);

export default adminRouter;
