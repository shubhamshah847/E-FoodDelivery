import express from 'express'
import {registerController,otpVerify,
    loginController,
    otpNewGenerate,
    registerGoogleController,
    getCurrentUser,
    userLogout
} from '../controllers/auth.controllers.js'
import { isAuth } from '../middleware/auth.middleware.js'
import rateLimiter from '../middleware/rateLimiter.middleware.js'

const router = express.Router()

router.post('/user/register',rateLimiter,registerController)
router.post('/user/login',rateLimiter,loginController)
router.post('/verify-otp',otpVerify)
router.post('/generate-new-otp',rateLimiter,otpNewGenerate)
router.post('/user/google/register',rateLimiter,registerGoogleController)
router.get('/get-current-user',isAuth,getCurrentUser)
router.get('/logout',isAuth,userLogout)

export default router ;