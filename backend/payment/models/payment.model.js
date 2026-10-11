
import mongoose from 'mongoose';
import paymentConfig from '../config/paymentConfig.js';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    Totalamount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: paymentConfig.PAYMENT_METHODS,
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(paymentConfig.PAYMENT_STATUS),
      default: paymentConfig.PAYMENT_STATUS.CREATED,
    },
    signature: {
      type: String,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const paymentModel = mongoose.model('Payment', paymentSchema);

export default paymentModel;