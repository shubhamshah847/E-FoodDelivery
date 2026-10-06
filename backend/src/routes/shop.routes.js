import express from 'express'
import { isAuth } from '../middleware/auth.middleware.js'
import { getMyShop, shopController } from '../controllers/shop.controllers.js'
import upload from '../middleware/multer.js'
import chatBotController from '../controllers/chatBot.controller.js'

const router = express.Router()

router.post('/shop/create',isAuth,upload.single('image'),shopController)
router.get('/get-my-shop',isAuth,getMyShop)
router.post('/chat',chatBotController)

export default router ;


