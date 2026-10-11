const paymentConfig = {
  RAZORPAY_FAKE_SECRET: process.env.RAZORPAY_FAKE_SECRET || 'yumzo_fake_razorpay_secret_key_2026',
  CURRENCY: 'INR',
  PAYMENT_STATUS: {
    CREATED: 'created',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },
  PAYMENT_METHODS: ['upi', 'card', 'netbanking'],
};

export default paymentConfig;