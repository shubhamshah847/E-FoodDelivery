import express from 'express'
import { isAuth } from '../middleware/auth.middleware.js';
import orderController from '../controllers/order.controller.js';

const router = express.Router()

router.post('/order',isAuth,orderController)



export default router ;