import express from "express"
import cors from "cors"
import session from "express-session"
import { connectDB } from"./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import promoCodeRouter from "./routes/promoCodeRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import statisticsRouter from "./routes/statisticsRoute.js"
import authRouter from "./routes/authRoute.js"
import addressRouter from "./routes/addressRoute.js"
import adminRouter from "./routes/adminRoute.js"
import passport from "./config/passport.js"

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())

// CORS configuration - support both development and production
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        'https://nguyentienthanh.id.vn',
        'https://www.nguyentienthanh.id.vn',
        'https://admin.nguyentienthanh.id.vn'
      ]
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

// Session configuration for passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

//db connection
connectDB();

//api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/promocode", promoCodeRouter)
app.use("/api/category", categoryRouter)
app.use("/api/statistics", statisticsRouter)
app.use("/api/auth", authRouter)
app.use("/api/address", addressRouter)
app.use("/api/admin", adminRouter)


app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
