import orderModel from "../models/order.model.js";
import shopModel from "../models/shop.model.js";
import userModel from "../models/user.models.js"
import itemModel from "../models/item.model.js";
import crypto from 'crypto'
const createOrder = async (req, res) => {

    const {
        payment,
        deliveryAddress,
        shopOrder
    } = req.body;
    if (!payment || !shopOrder || !deliveryAddress) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const finalShopData = [];
        let totalAmount = 0;

        for (const shopData of shopOrder) {

            const shopId = await shopModel.findById(shopData.shop);

            if (!shopId) {
                return res.status(404).json({
                    message: "shop does not exist"
                });
            }

            const ownerId = shopId.owner;

            if (!ownerId) {
                return res.status(400).json({
                    message: "Owner does not exist"
                });
            }

            const finalItemData = [];

            // shopData.items = array of items
            for (const itemData of shopData.items) {

                const itemId = itemData.item;
                const quantity = itemData.quantity;

                // validate quantity
                if (
                    quantity === undefined ||
                    quantity === null ||
                    typeof quantity !== "number" ||
                    !Number.isInteger(quantity) ||
                    quantity <= 0
                ) {
                    return res.status(400).json({
                        message: "Invalid quantity"
                    });
                }

                // Find the actual food item
                const item = await itemModel.findById(itemId);
                if (!item) {
                    return res.status(404).json({
                        message: "Item does not exist"
                    });
                }

                // Check stock
                if (quantity > item.quantity) {
                    return res.status(400).json({
                        message: `Only ${item.quantity} ${item.name} items are available`
                    });
                }

                // Calculate subtotal from DB price
                const subTotal = item.price * quantity;

                totalAmount += subTotal;

                finalItemData.push({
                    items: item._id,
                    price: item.price,
                    quantity: quantity,
                    subTotal: subTotal
                });
            }
            finalShopData.push({
                shop: shopId._id,
                owner: ownerId,
                shopOrderItem: finalItemData
            });
        }
        const orderId = `YUM-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
        const order = await orderModel.create({
            user: req.user,
            paymentMethod: payment,
            deliveryAddress,
            totalAmount: totalAmount,
            shopOrder: finalShopData,
            orderId,
            status: "pending"
        });
     await orderModel.findOneAndUpdate(
    { orderId: order.orderId },
    { status: "confirmed" }
);
        return res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (err) {

        console.error("Order creation failed:", err);

        return res.status(500).json({
            message: "Order not created",
            error: err.message
        });
    }
};
const getMyOrder = async (req, res) => {
    const _id = req.user
    if (!_id) return res.status(401).json({ message: "Authentication failed. Please log in again." })
    try {
        const order = await orderModel.find({ user: _id })
            .populate("shopOrder.shop")
            .populate("shopOrder.shopOrderItem.items")

        if (order.length === 0) return res.status(404).json({ message: "order not found" })
        res.status(200).json({ message: "Orders fetched successfully!", order })
    } catch (err) {
        console.error("Order lookup failed:", err)

        res.status(500).json({
            message: "Unable to fetch orders right now. Please try again later."

        })
    }
}
const getShopOder = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Authentication failed. Please log in again." })
    try {
        const shop = await shopModel.findOne({
            owner: req.user
        });
        if (!shop) return res.status(403).json({ message: "You do not have an owner shop" });
        const orders = await orderModel.find({
            "shopOrder.shop": shop._id
        })
            .populate("user", "name")
            .populate("shopOrder.shop")
            .populate("shopOrder.shopOrderItem.items");

        if (orders.length === 0) {
            return res.status(200).json({ message: "No orders found", orders: [] });
        }

        const ownerOrders = orders.map((order) => {
            const orderData = order.toObject();
            orderData.shopOrder = orderData.shopOrder.filter(
                (shopOrder) => String(shopOrder.shop?._id || shopOrder.shop) === String(shop._id)
            );
            return orderData;
        });

        return res.status(200).json({ message: "Orders fetched successfully!", orders: ownerOrders });
    } catch (err) {
        console.error("Owner order lookup failed:", err)
        return res.status(500).json({
            message: "Unable to fetch orders right now. Please try again later."

        })
    }
}
const getOrderDetailsByOwner = async(req,res)=>{
    const { orderId } = req.params;
    if (!req.user) return res.status(401).json({ message: "Authentication failed. Please log in again." });
    if (!orderId) return res.status(400).json({ message: "Order ID is required" });

    try {
        const shop = await shopModel.findOne({ owner: req.user });
        if (!shop) return res.status(403).json({ message: "You do not have an owner shop" });

        const order = await orderModel.findOne({
            orderId,
            "shopOrder.shop": shop._id
        })
            .populate("user", "name")
            .populate("shopOrder.shop")
            .populate("shopOrder.shopOrderItem.items");

        if (!order) return res.status(404).json({ message: "Order not found for this shop" });

        const orderData = order.toObject();
        orderData.shopOrder = orderData.shopOrder.filter(
            (shopOrder) => String(shopOrder.shop?._id || shopOrder.shop) === String(shop._id)
        );

        return res.status(200).json({ message: "Order details fetched", order: orderData });
    } catch (err) {
        console.error("Owner order details lookup failed:", err);
        return res.status(500).json({ message: "Unable to fetch order details" });
    }
}

const updateOrderStatusByOwner = async (req, res) => {
    const { orderId } = req.params;
    const { status: nextStatus } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: "Authentication failed. Please log in again." });
    }

    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(nextStatus)) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    try {
        const shop = await shopModel.findOne({ owner: req.user });
        if (!shop) {
            return res.status(403).json({ message: "You do not have an owner shop" });
        }

        const order = await orderModel.findOne({
            orderId,
            "shopOrder.shop": shop._id
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found for this shop" });
        }

        const allowedTransitions = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["preparing", "cancelled"],
            preparing: ["out_for_delivery", "cancelled"],
            out_for_delivery: ["delivered"],
            delivered: [],
            cancelled: []
        };

        if (!allowedTransitions[order.status]?.includes(nextStatus)) {
            return res.status(409).json({
                message: `Order status cannot move from ${order.status} to ${nextStatus}`
            });
        }

        order.status = nextStatus;
        await order.save();

        return res.status(200).json({
            message: "Order status updated",
            order: {
                orderId: order.orderId,
                status: order.status,
                updatedAt: order.updatedAt
            }
        });
    } catch (err) {
        console.error("Owner order status update failed:", err);
        return res.status(500).json({ message: "Unable to update order status" });
    }
};


export default { getMyOrder, getShopOder, createOrder, getOrderDetailsByOwner, updateOrderStatusByOwner }