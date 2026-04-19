const Review = require('../Models/Review');
const Order = require('../Models/Order');

const submitReview = async (req, res) => {
    try {
        const { vendorId, orderId, rating, comment } = req.body;
        const userId = req.user._id;

        if (!vendorId || !orderId || !rating) {
            return res.status(400).json({ message: "Vendor ID, Order ID, and Rating are required", success: false });
        }

        // Check if the order exists and belongs to the user
        const order = await Order.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized", success: false });
        }

        // Check if the order is delivered
        if (order.orderStatus.toLowerCase() !== 'delivered') {
            return res.status(400).json({ message: "You can only rate delivered orders", success: false });
        }

        // Check for existing review
        const existingReview = await Review.findOne({ userId, orderId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this order", success: false });
        }

        const newReview = new Review({
            userId,
            vendorId,
            orderId,
            rating,
            comment
        });

        await newReview.save();

        res.status(201).json({
            message: "Review submitted successfully",
            success: true,
            review: newReview
        });
    } catch (err) {
        console.error("Error submitting review:", err);
        res.status(500).json({ message: "Server error submitting review", success: false });
    }
};

const getVendorReviews = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const reviews = await Review.find({ vendorId })
            .populate('userId', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (err) {
        console.error("Error fetching vendor reviews:", err);
        res.status(500).json({ message: "Server error fetching reviews", success: false });
    }
};

const checkOrderReview = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const review = await Review.findOne({ userId, orderId });

        res.status(200).json({
            success: true,
            hasReviewed: !!review,
            review: review
        });
    } catch (err) {
        console.error("Error checking order review:", err);
        res.status(500).json({ message: "Server error checking review", success: false });
    }
};

module.exports = {
    submitReview,
    getVendorReviews,
    checkOrderReview
};
