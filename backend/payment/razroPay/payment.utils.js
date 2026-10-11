import crypto from 'crypto';
import paymentConfig from '../config/paymentConfig.js';

/**
 * Generate a unique Fake Razorpay Order ID (e.g., order_fake_8f3a9a1b)
 */
const generatePaymentId = () => {
  return `order_fake_${crypto.randomBytes(8).toString('hex')}`;
};

/**
 * Generate a unique Fake Razorpay Transaction ID (e.g., pay_fake_1c8e2b4f)
 */
const generateTransactionId = () => {
  return `pay_fake_${crypto.randomBytes(8).toString('hex')}`;
};

/**
 * Generate HMAC-SHA256 signature matching Razorpay signature logic:
 * hmac_sha256(paymentId + "|" + transactionId, secret)
 */
const generatePaymentSignature = (paymentId, transactionId) => {
  const payload = `${paymentId}|${transactionId}`;
  return crypto
    .createHmac('sha256', paymentConfig.RAZORPAY_FAKE_SECRET)
    .update(payload)
    .digest('hex');
};

/**
 * Verify HMAC-SHA256 signature using timingSafeEqual to prevent timing attacks
 */
const verifyPaymentSignature = (paymentId, transactionId, signature) => {
  const expectedSignature = generatePaymentSignature(paymentId, transactionId);
  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
  const actualBuffer = Buffer.from(signature, 'utf-8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

export {
  generatePaymentId,
  generateTransactionId,
  generatePaymentSignature,
  verifyPaymentSignature,
};