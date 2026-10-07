import express from 'express'
import { isAuth } from '../middleware/auth.middleware.js';
import orderController from '../controllers/order.controller.js';

const router = express.Router()

router.post('/order',isAuth,orderController.createOrder)
router.get('/order/get-my-orders',isAuth,orderController.getMyOrder)
router.get('/owner/order/get-my-orders',isAuth,orderController.getShopOder)
router.get('/owner/get-order-details/:orderId',isAuth,orderController.getOrderDetailsByOwner)
router.patch('/owner/order/:orderId/status',isAuth,orderController.updateOrderStatusByOwner)

export default router ;