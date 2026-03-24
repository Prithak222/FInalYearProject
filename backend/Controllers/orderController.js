const Order = require("../Models/Order");
const Cart = require("../Models/cart");

const createOrder = async (req, res) => {
    try {
        const { shippingInfo, items, totalAmount } = req.body;
        const userId = req.user._id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order", success: false });
        }

        const newOrder = new Order({
            userId,
            items: items.map(item => ({
                ...item,
                vendorId: item.vendorId // Ensure vendorId is passed from frontend
            })),
            shippingInfo,
            totalAmount,
            paymentStatus: 'Pending',
            orderStatus: 'Pending'
        });

        const savedOrder = await newOrder.save();

        // Clear the user's cart after successful order
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({
            message: "Order placed successfully",
            success: true,
            order: savedOrder
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Server error creating order", success: false });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching orders", success: false });
    }
};

const getVendorOrders = async (req, res) => {
    try {
        const vendorId = req.user._id;
        // Find orders that contain at least one item from this vendor
        const orders = await Order.find({ "items.vendorId": vendorId }).sort({ createdAt: -1 });
        
        // Optionally, filter items within each order to only show those belonging to this vendor
        const vendorSpecificOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.items = orderObj.items.filter(item => item.vendorId.toString() === vendorId.toString());
            return orderObj;
        });

        res.status(200).json(vendorSpecificOrders);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching vendor orders", success: false });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getVendorOrders
};
