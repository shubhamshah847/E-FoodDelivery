import mongoose from mongoose;

const shopOrderItem = new mongoose.Schema({

    items: {
        type: mongoose.Schema.type.objectId,
        ref: "item"
    },
    price:Number,
    quantity:Number
}, { timestamps: true })

const shopOrderSchema = new mongoose.Schema({
    shop: {
        shop: mongoose.Schema.Types.objectId,
        ref: "shop"
    },
    owner: {
        shop: mongoose.Schema.Types.objectId,
        ref: "user"
    },
    shopOrderItem: [shopOrderItem],
    subTotal: Number,
}, { timestamps: true })
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.type.objectId,
        ref: "user"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number

    },
    totalAmount: {
        type: Number
    },
    shopOrder: [shopOrderSchema]

}, { timestamps: true })
const userModel = mongoose.model("order", userSchema)

export default userModel ;