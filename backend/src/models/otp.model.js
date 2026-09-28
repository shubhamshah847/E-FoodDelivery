import mongoose, { Types } from "mongoose";

const otpSchema  = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    otp:{
        type:String,
        required:true,

    },
    expiresAt:{
        type:Date,
        required:true,
        default:()=>new Date(Date.now()+5*60*1000)
    }
},{
    timestamps:true
})
    
const otpModel = mongoose.model("otp",otpSchema)

export default otpModel;
