import express from 'express';
import paymentController from './payment.controller.js';
import { isAuth } from '../../src/middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', isAuth, paymentController.createPayment);
router.post('/process-simulation', isAuth, paymentController.simulatePaymentProcessing);
router.post('/verify', isAuth, paymentController.verifyPayment);
router.post('/refund', isAuth, paymentController.refundPayment);

export default router;