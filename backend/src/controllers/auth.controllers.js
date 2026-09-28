import userModel from "../models/user.models.js"
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import { redis } from "../app.js"
import generateOtp from "../utils/otp.js"
import { sendOtp, regrestationEmail } from "../services/email.service.js"
import otpModel from "../models/otp.model.js"



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
        try {
            redis.set(`otp:${user._id}`, otp, "EX", 300)
        } catch (err) {
            console.log("redis set error :", err)
        }

        //    const userOtp =  await otpModel.create({
        //     userId:user._id
        //     ,otp
        // })
        if (!otp) {
            return res.status(500).json({
                message: "otp not generated"
            })
        }
        try {
            await sendOtp(user.email, user.name, otp) // email send
        } catch (error) {
            res.status(500).json({message:"otp cant send . try agian"})
          return  console.log(error)
        }


        res.status(200).json({
            message: "user created successfully",
            user: user
        })

    }
    catch (err) {
        await session.abortTransaction();
        console.log(err)
        res.status(500).json({
            message: "user not created"
        })
    }


}
export const loginController = async (req, res) => {
    const { email, password } = req.body
    if (!password.length >= 7) {
        return res.status(400).json({
            message: "min 6 letters password required"
        })
    }
    if (!email || !password) {
        return res.status(400).json({
            message: "email and password are required"
        })
    }
    // try {
         const isExist = await userModel.findOne({ email }).select('-password')
        if (!isExist) {
            return res.status(422).json({
                message: "user not exist"
            })
        }
        if (!isExist.isVerified) return res.status(403).json({ message: "verify your email" })
    //     const isValidPassword = await bcrypt.compare(password, isExist.password)

    //     if (isValidPassword) {

console.log("esexist:-",isExist)
            const token = jwt.sign({
                id: isExist._id
            }, process.env.JWT_WEB_TOKEN, {
                expiresIn: '15d'
            })
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 15 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({
                messgae: "login successfully", isExist
             })
         }

    //     return res.status(400).json({
    //         message: "email or password wrong"
    //     })
    // }
    // catch (err) {
    //     console.log(err)
    //     res.status(500).json({
    //         message: "not logged something went wrong"
    //     })
    // }

export const otpVerify = async (req, res) => {
    const { _id, otp } = req.body
    if (!_id || !otp) {
        return res.status(403).json({
            message: "bhai kuch to gadbad hai"
        })
    }
    try {
        // const DbOtp = await otpModel.findOne({userId:_id})
        try {
            const redisOtp = await redis.get(`otp:${_id}`)
            if (!redisOtp) return res.status(400).json({ message: "otp not found or expired" })
            const isOptValid = redisOtp === otp
         if (!isOptValid) {
            return res.status(400).json({
                message: "otp wrong"
            })
        }
        } catch (error) {
            console.log("redis get error :", error)
        }

        const ttl = await redis.ttl(`otp:${_id}`);

        if (ttl === -2) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

       
        const userUpdate_verified = await userModel.findByIdAndUpdate(_id,
            { isVerified: true }, { new: true }
        )
        await redis.del(`otp:{_id}`)
        res.status(200).json({
            message: "otp verified"
        })
        try {
            //  await otpModel.deleteOne({userId:_id})
            await regrestationEmail(userUpdate_verified.email, userUpdate_verified.name)
        }
        catch (err) {
            await redis.del(`otp:{_id}`)
            console.log("send regrestation email failed:-", err)
            return res.status(500).json({
                message: "send regrestation email failed"
            })
        }


    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "something went worng while verifying otp "
        })
    }

}
export const otpNewGenerate = async (req, res) => {
    const { _id } = req.body
    const isOtpExist = await otpModel.findOne({ userId: _id })

    // if(isOtpExist){
    //     await otpModel.deleteMany({userId:_id})
    // }
    const otp = generateOtp()
    try {
        //  await otpModel.create({
        //     userId:_id,otp
        //  })
        const redisOtp = await redis.set(`otp:${_id}`, otp, "EX", 300)



        const user = await userModel.findById(_id)
        try {
            console.log("otp sended")
            await sendOtp(user.email, user.name, otp) 
        }
        catch (err) {
            res.status(500).json({
                message: "email not send"
            })
        }
        res.status(200).json({
            message: "otp send"
        })
    }
    catch (err) {
        console.log(" while creating a new otp:-", err)
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
        await regrestationEmail(updated_user.email, updated_user.name)


        res.status(200).json({
            message: "user created successfully",
            user: user
        })

    }
    catch (err) {
        // await session.abortTransaction();
        console.log(err)
        res.status(500).json({
            message: "user not created"
        })
    }


}
export const getCurrentUser = async (req, res) => {
    const id = req.user
    console.log("id:", id)
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


