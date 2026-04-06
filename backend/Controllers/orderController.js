const Order = require("../Models/Order");
const Cart = require("../Models/cart");
const transporter = require("../Utils/emailConfig");

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

        const order = await Order.findOne({ _id: id, vendorId }).populate('userId', 'name email').populate('vendorId', 'shopName');
        if (!order) {
            return res.status(404).json({ message: "Order not found or access denied", success: false });
        }

        order.orderStatus = status;
        await order.save();

        // Send Shipment Email if status is 'Shipped'
        if (status === 'Shipped' && order.userId && order.userId.email) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: order.userId.email,
                    subject: "Your DosroDeal Order has Been Shipped! 🚚",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: #4f46e5; text-align: center;">Order Shipped!</h2>
                            <p>Hi ${order.userId.name || 'Valued Customer'},</p>
                            <p>Good news! Your order <strong>#${order._id}</strong> has been shipped by <strong>${order.vendorId?.shopName || 'the vendor'}</strong>.</p>
                            <p><strong>Shipping To:</strong><br>${order.shippingInfo.name}<br>${order.shippingInfo.address}<br>${order.shippingInfo.phone}</p>
                            <p>It's on its way to you. You can track your order status in your dashboard.</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL}/my-orders" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Orders</a>
                            </div>
                            <p>Thank you for shopping with DosroDeal!</p>
                            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                            <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 DosroDeal. All rights reserved.</p>
                        </div>
                    `,
                };
                await transporter.sendMail(mailOptions);
            } catch (emailErr) {
                console.error("Failed to send shipment email:", emailErr);
            }
        }

        res.status(200).json({ message: `Order status updated to ${status}`, success: true, order });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ message: "Server error updating order status", success: false });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: id, userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Processing') {
            return res.status(400).json({ 
                message: "Order cannot be cancelled after it has been shipped", 
                success: false 
            });
        }

        order.orderStatus = 'Cancelled';
        await order.save();

        res.status(200).json({ message: "Order cancelled successfully", success: true, order });
    } catch (err) {
        console.error("Error cancelling order:", err);
        res.status(500).json({ message: "Server error cancelling order", success: false });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getVendorOrders,
    getAllOrdersForAdmin,
    updateOrderStatus,
    cancelOrder
};
