import express from 'express'
import { isAuth } from '../middleware/auth.middleware.js';
import orderController from '../controllers/order.controller.js';

const router = express.Router()

router.post('/order',isAuth,orderController.createOrder)
router.get('/order/get-my-orders',isAuth,orderController.getMyOrder)
router.get('/owner/order/get-my-orders',isAuth,orderController.getShopOder)


export default router ;