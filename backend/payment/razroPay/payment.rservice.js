import Payment from '../models/payment.model.js';
import orderModel from '../../src/models/order.model.js';
import paymentConfig from '../config/paymentConfig.js';
import {
  generatePaymentId,
  generateTransactionId,
  generatePaymentSignature,
  verifyPaymentSignature,
} from './payment.utils.js';

class PaymentService {
  async createPayment({ orderId, user }) {
    const order = await orderModel.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (String(order.user) !== String(user)) {
      throw new Error('Unauthorized access to order');
    }

    const existingPayment = await Payment.findOne({
      orderId: order._id,
      paymentStatus: paymentConfig.PAYMENT_STATUS.PAID,
    });

    if (existingPayment) {
      throw new Error('Order has already been paid for');
    }

    const paymentId = generatePaymentId();

    const payment = await Payment.create({
      paymentId,
      orderId: order._id,
      user: order.user,
      amount: order.totalAmount,
      currency: paymentConfig.CURRENCY,
      paymentStatus: paymentConfig.PAYMENT_STATUS.CREATED,
    });

    return {
      paymentId: payment.paymentId,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.paymentStatus,
    };
  }

  async simulatePaymentProcessing({ paymentId, paymentMethod, isSuccess = true }) {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      throw new Error('Payment record not found');
    }

    if (payment.paymentStatus === paymentConfig.PAYMENT_STATUS.PAID) {
      throw new Error('Payment already completed');
    }

    if (!paymentConfig.PAYMENT_METHODS.includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    if (!isSuccess) {
      payment.paymentStatus = paymentConfig.PAYMENT_STATUS.FAILED;
      payment.paymentMethod = paymentMethod;
      payment.failureReason = 'Simulated payment processing failure by user';
      await payment.save();

      return {
        paymentId: payment.paymentId,
        paymentStatus: payment.paymentStatus,
        message: 'Payment processing failed',
      };
    }

    const transactionId = generateTransactionId();
    const signature = generatePaymentSignature(paymentId, transactionId);

    payment.paymentMethod = paymentMethod;
    payment.paymentStatus = paymentConfig.PAYMENT_STATUS.PROCESSING;
    await payment.save();

    return {
      paymentId: payment.paymentId,
      transactionId,
      signature,
      paymentMethod,
      amount: payment.amount,
      currency: payment.currency,
    };
  }

  async verifyPayment({ paymentId, transactionId, signature }) {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      throw new Error('Payment record not found');
    }

    if (payment.paymentStatus === paymentConfig.PAYMENT_STATUS.PAID) {
      return {
        success: true,
        message: 'Payment already verified and paid',
        payment,
      };
    }

    if (payment.paymentStatus === paymentConfig.PAYMENT_STATUS.FAILED) {
      throw new Error('Cannot verify a failed payment session');
    }

    const isValidSignature = verifyPaymentSignature(paymentId, transactionId, signature);
    if (!isValidSignature) {
      payment.paymentStatus = paymentConfig.PAYMENT_STATUS.FAILED;
      payment.failureReason = 'Invalid payment signature verification';
      await payment.save();
      throw new Error('Payment verification failed: Signature mismatch');
    }

    payment.transactionId = transactionId;
    payment.signature = signature;
    payment.paymentStatus = paymentConfig.PAYMENT_STATUS.PAID;
    await payment.save();

    const order = await orderModel.findById(payment.orderId);
    if (order && order.status !== 'confirmed') {
      order.status = 'confirmed';
      await order.save();
    }

    return {
      success: true,
      message: 'Payment verified successfully and order confirmed',
      paymentId: payment.paymentId,
      transactionId: payment.transactionId,
      orderId: payment.orderId,
      status: payment.paymentStatus,
    };
  }

  async refundPayment({ paymentId, reason }) {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      throw new Error('Payment record not found');
    }

    if (payment.paymentStatus !== paymentConfig.PAYMENT_STATUS.PAID) {
      throw new Error('Only paid transactions can be refunded');
    }

    payment.paymentStatus = paymentConfig.PAYMENT_STATUS.REFUNDED;
    payment.failureReason = reason || 'Customer requested refund';
    await payment.save();

    const order = await orderModel.findById(payment.orderId);
    if (order) {
      order.status = 'cancelled';
      await order.save();
    }

    return payment;
  }
}

export default new PaymentService();