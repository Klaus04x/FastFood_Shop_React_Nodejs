import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://huyenmoi13aa:goku13aa@cluster0.z3i4sgh.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}