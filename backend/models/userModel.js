import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique :true},
    password: {type: String, required: true},
    avatar: {type: String, default: ''},
    cartData: {type: Object, default:{}},
    provider: {type: String, default: 'local', enum: ['local', 'google', 'github']},
    googleId: {type: String, sparse: true},
    githubId: {type: String, sparse: true},
    addresses: {
        type: [{
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            email: {type: String, required: true},
            phone: {type: String, required: true},
            street: {type: String, required: true},
            city: {type: String, required: true},
            state: {type: String, required: true},
            zipcode: {type: String, required: true},
            country: {type: String, required: true},
            isDefault: {type: Boolean, default: false}
        }],
        default: []
    }
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;