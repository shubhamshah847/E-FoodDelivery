import mongoose from "mongoose"

const shopOrderItem = new mongoose.Schema({

    items: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "item"
    },
    price: Number,
    quantity: Number,
    subTotal: Number
}, { timestamps: true })

const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
   payment: {
      type:Boolean,
      default:false
    },
    shopOrderItem: [shopOrderItem],
    subTotal: Number,
}, { timestamps: true })
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },

    deliveryAddress: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number
    },
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },
    shopOrder: [shopOrderSchema]

}, { timestamps: true })
const orderModel = mongoose.model("order", orderSchema)

export default orderModel;