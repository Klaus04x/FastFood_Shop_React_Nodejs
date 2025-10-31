import express from "express"
import cors from "cors"
import { connectDB } from"./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import promoCodeRouter from "./routes/promoCodeRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import statisticsRouter from "./routes/statisticsRoute.js"

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

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


app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
