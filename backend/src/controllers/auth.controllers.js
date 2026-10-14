import userModel from "../models/user.models.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import generateOtp from "../utils/otp.js"
import { sendOtp, regrestationEmail } from "../services/email.service.js"
import otpModel from "../models/otp.model.js"

const saveOtp = async (userId, otp) => {
    await otpModel.deleteMany({ userId })
    return otpModel.create({
        userId,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })
}
export const registerController = async (req, res) => {
    const { name, email, password, googleId } = req.body
    if (!email || !name) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }
    if (password) {
        if (password.length < 7) {
            return res.status(400).json({
                message: "Minimum 7 characters password required"
            })
        }
    }
    else if (!googleId) {
        return res.status(400).json({
            message: "Password or Google ID is required , sign again with google"
        });
    }


    const isExist = await userModel.findOne({
        email
    }).select("-authValue")

    if (isExist) {
        return res.status(422).json({
            message: "user already exist",
            status: "failed"
        })
    }
    try {
        const authValue = password ? await bcrypt.hash(password, 10) : googleId
        const user = await userModel.create({
            name, email,
            password: authValue
        })
        const otp = generateOtp()
        if (!otp) {
            return res.status(500).json({
                message: "otp not generated"
            })
        }
        await saveOtp(user._id, otp)
      
            await sendOtp(user.email, user.name, otp) // email send
        


        res.status(200).json({
            message: "user created successfully",
            user: user
        })

    }
    catch (err) {
        console.error("User registration failed:", err)
        res.status(500).json({
            message: "user not created"
        })
    }


}
export const loginController = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "email and password are required"
        })
    }
    if (password.length < 6) {
        return res.status(400).json({
            message: "min 6 letters password required"
        })
    }
    try {
        const isExist = await userModel.findOne({ email })
        if (!isExist) {
            return res.status(422).json({
                message: "user not exist"
            })
        }
        if (!isExist.isVerified) return res.status(403).json({ message: "verify your email" })
        const isValidPassword = await bcrypt.compare(password, isExist.password)

        if (isValidPassword) {

            const token = jwt.sign({
                id: isExist._id
            }, process.env.JWT_WEB_TOKEN, {
                expiresIn: '15d'
            })
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({
                message: "login successfully",
                user: { ...isExist.toObject(), password: undefined }
             })
         }

        return res.status(400).json({
            message: "email or password wrong"
        })
    }
    catch (err) {
        res.status(500).json({
            message: "not logged something went wrong"
        })
    }
}
export const otpVerify = async (req, res) => {
    const { _id, otp } = req.body
    if (!_id || !otp) {
        return res.status(403).json({
            message: "bhai kuch to gadbad hai"
        })
    }
    try {
        const storedOtp = await otpModel.findOne({ userId: _id }).sort({ createdAt: -1 })
        if (!storedOtp) {
            return res.status(400).json({
                message: "otp not found or expired"
            })
        }

        if (storedOtp.expiresAt <= new Date()) {
            await otpModel.deleteOne({ _id: storedOtp._id })
            return res.status(400).json({ message: "OTP expired" })
        }

        if (storedOtp.otp !== String(otp)) {
            return res.status(400).json({
                message: "otp wrong"
            });
        }

        const userUpdate_verified = await userModel.findByIdAndUpdate(_id,
            { isVerified: true }, { new: true }
        )
        if (!userUpdate_verified) {
            return res.status(404).json({ message: "user not found" })
        }

        await otpModel.deleteOne({ _id: storedOtp._id })
        await regrestationEmail(userUpdate_verified.email, userUpdate_verified.name)
        return res.status(200).json({ message: "otp verified" })

    }
    catch (err) {
        console.error("OTP verification failed:", err)
        return res.status(500).json({
            message: "something went wrong while verifying otp"
        })
    }

}
export const otpNewGenerate = async (req, res) => {
    const { _id } = req.body
    try {
        const user = await userModel.findById(_id)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        const otp = generateOtp()
        await saveOtp(user._id, otp)
        try {
            await sendOtp(user.email, user.name, otp) 
        }
        catch (err) {
            console.error("OTP email send failed:", err)
            return res.status(500).json({
                message: "email not send"
            })
        }
        return res.status(200).json({
            message: "otp send"
        })
    }
    catch (err) {
        console.error("OTP generation failed:", err)
        res.status(500).json({
            message: "some thing went wrong while creating a new otp"
        })
    }

}
export const registerGoogleController = async (req, res) => {
    const { name, email, googleId } = req.body
    if (!email || !name) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    if (!googleId) {
        return res.status(400).json({
            message: "Password or Google ID is required , sign again with google"
        });
    }


    const isExist = await userModel.findOne({
        email
    }).select("-authValue")

    if (isExist) {
        return res.status(422).json({
            message: "user already exist",
            status: "failed"
        })
    }
    try {

        const user = await userModel.create({
            name, email,
            password: googleId
        })
        
        const updated_user = await userModel.findByIdAndUpdate(user._id,
            { isVerified: true }, { new: true }
        )

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_WEB_TOKEN, {
            expiresIn: '15d'
        })
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 24 * 60 * 60 * 1000
        })
        try{
        await regrestationEmail(updated_user.email, updated_user.name)

        }
        catch(err){
            console.log(err)
        }
        res.status(200).json({
            message: "user created successfully",
            user: user
        })

    }
    catch (err) {
        // await session.abortTransaction();
        console.error("Google registration failed:", err)
        res.status(500).json({
            message:"user not created"
        })
    }


}
export const getCurrentUser = async (req, res) => {
    const id = req.user
    if (!id) return res.status(401).json({ message: "id not found" })
    try {
        const user = await userModel.findById(id).select("-password")
        res.status(200).json({
            message: "successfully user found", user

        })
    } catch (error) {
        res.json(401).json({
            message: "user not found"

        })
    }
}
export const userLogout = async (req,res)=>{
    try{
   await res.clearCookie('token')
   res.status(200).json({
    message:"logout successfully"
   })
    }
    catch(err){
        res.status(500).json({
            message:"logout bhayena !! "
        })
    }
}


