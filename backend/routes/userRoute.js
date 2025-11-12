import express from "express"
import { loginUser, registerUser, getUserProfile, updateUserProfile } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"
import multer from "multer"

const userRouter = express.Router()

// Image Storage Engine for avatar
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `avatar_${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/profile", authMiddleware, getUserProfile)
userRouter.post("/update-profile", authMiddleware, updateUserProfile)
userRouter.post("/upload-avatar", authMiddleware, upload.single("avatar"), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: "No file uploaded" })
    }
    const imageUrl = `http://localhost:4000/images/${req.file.filename}`
    res.json({ success: true, imageUrl })
})

export default userRouter;