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
         type:mongoose.Schema.Types.ObjectId,
        ref: "shop"
    },
    owner: {
         type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    shopOrderItem: [shopOrderItem],
    subTotal: Number,
}, { timestamps: true })
const orderSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },
    deliveryAddress:{
        type:String,
        required:true
    },
    totalAmount: {
        type: Number
    },
    shopOrder: [shopOrderSchema]

}, { timestamps: true })
const orderModel = mongoose.model("order",orderSchema)

export default orderModel;