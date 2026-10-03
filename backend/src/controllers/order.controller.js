import orderModel from "../models/order.model.js";
import shopModel from "../models/shop.model.js";
import itemModel from "../models/item.model.js";

const orderController = async (req, res) => {

    const {
        payment,
        deliveryAddress,
        shopOrder
    } = req.body;
    console.log(
        payment,
        deliveryAddress,
        shopOrder
    )
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

        const order = await orderModel.create({
            user: req.user,
            paymentMethod: payment,
            deliveryAddress,
            totalAmount: totalAmount,
            shopOrder: finalShopData
        });

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

export default orderController;