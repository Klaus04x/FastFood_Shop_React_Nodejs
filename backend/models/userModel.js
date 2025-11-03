import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique :true},
    password: {type: String, required: true},
    cartData: {type: Object, default:{}},
    provider: {type: String, default: 'local', enum: ['local', 'google', 'github']},
    googleId: {type: String, sparse: true},
    githubId: {type: String, sparse: true}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;