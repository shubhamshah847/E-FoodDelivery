import paymentService from './payment.rservice.js';

class PaymentController {
  async createPayment(req, res) {
    try {
      const { orderId } = req.body;
      const user = req.user;

      const result = await paymentService.createPayment({ orderId, user });
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async simulatePaymentProcessing(req, res) {
    try {
      const { paymentId, paymentMethod, isSuccess } = req.body;

      const result = await paymentService.simulatePaymentProcessing({
        paymentId,
        paymentMethod,
        isSuccess,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { paymentId, transactionId, signature } = req.body;

      const result = await paymentService.verifyPayment({
        paymentId,
        transactionId,
        signature,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async refundPayment(req, res) {
    try {
      const { paymentId, reason } = req.body;

      const result = await paymentService.refundPayment({ paymentId, reason });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
        console.error("Payment refund failed:", error)
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new PaymentController();