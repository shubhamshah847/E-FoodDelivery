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
    console.log("shoporder:",shopOrder)
    if (!payment || !shopOrder || !deliveryAddress) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const finalShopData = [];
        let totalAmount = 0;

        for (const shopData of shopOrder) {

            console.log("SHOP ID FROM FRONTEND:", shopData.shop);

            const shopId = await shopModel.findById(shopData.shop);

            console.log("SHOP FOUND:", shopId);

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
console.log(item)
                if (!item) {
                    return res.status(404).json({
                        message: "Item does not exist"
                    });
                }

                // Check stock
                console.log(quantity)
                console.log(item.quantity)
                if (quantity >=item.quantity) {
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
            console.log("final",finalItemData)

            finalShopData.push({
                shop: shopId._id,
                owner: ownerId,
                shopOrderItem: finalItemData
            });
        }
        console.log("final",finalShopData)

        const orderId = `YUM-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
        const order = await orderModel.create({
            user: req.user,
            paymentMethod: payment,
            deliveryAddress,
            totalAmount: totalAmount,
            shopOrder: finalShopData,
            orderId,
            status: "confirmed"
        });
        console.log("order:",order)

        return res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (err) {

        console.log("ORDER NOT CREATED:", err);

        return res.status(500).json({
            message: "Order not created",
            error: err.message
        });
    }
};
const getMyOrder = async (req, res) => {
    const _id = req.user
    console.log("order user id", _id)
    if (!_id) return res.status(401).json({ message: "Authentication failed. Please log in again." })
    try {
        const order = await orderModel.find({ user: _id }).populate("shopOrder.shop").populate("shopOrder.shopOrderItem")

        if (order.length === 0) return res.status(404).json({ message: "order not found" })
        res.status(200).json({ message: "Orders fetched successfully!", order })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: "Unable to fetch orders right now. Please try again later."

        })
    }
}

const getShopOder = async (req, res) => {
    const _id = req.user
console.log("d",_id)
    if (!_id) return res.status(401).json({ message: "Authentication failed. Please log in again." })
    try {
        const shop = await shopModel.findOne({
            owner: req.user
        });
        console.log("d",_id)
        if(!shop) return res.status(403).json({message:"you have not permission"})
        const orders = await orderModel.find({
            "shopOrder.shop":shop._id

        })
          if(!orders) return res.status(403).json({message:"order not found"})
        
        //  
        //   const orders = await o.find({owner:_id}).populate("shopOder.shop").populate("shopOrder.items")
        if (orders.length == 0) return res.status(404).json({ message: "order not found" })
        res.staus(200).json({ message: "Orders fetched successfully!", orders })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to fetch orders right now. Please try again later."

        })
    }
}

export default { getMyOrder, getShopOder, createOrder }