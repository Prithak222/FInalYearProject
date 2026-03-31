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
        // Search by top-level vendorId now
        const orders = await Order.find({ vendorId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching vendor orders", success: false });
    }
};

const getAllOrdersForAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('vendorId', 'name email')
            .sort({ createdAt: -1 });
            
        res.status(200).json(orders);
    } catch (err) {
        console.error("Error fetching all orders for admin:", err);
        res.status(500).json({ message: "Server error fetching admin orders", success: false });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const vendorId = req.user._id;

        const order = await Order.findOne({ _id: id, vendorId });
        if (!order) {
            return res.status(404).json({ message: "Order not found or access denied", success: false });
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({ message: `Order status updated to ${status}`, success: true, order });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ message: "Server error updating order status", success: false });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getVendorOrders,
    getAllOrdersForAdmin,
    updateOrderStatus
};
