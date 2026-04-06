const PayoutRequest = require('../Models/PayoutRequest');
const Order = require('../Models/Order');

const requestPayout = async (req, res) => {
    try {
        const { amount, bankDetails } = req.body;
        const vendorId = req.user._id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid payout amount', success: false });
        }

        // 1. Calculate Total Earned from DELIVERED orders
        const deliveredOrders = await Order.find({ 
            vendorId, 
            orderStatus: 'Delivered' 
        });
        const totalEarned = deliveredOrders.reduce((sum, order) => sum + (order.vendorEarning || 0), 0);

        // 2. Calculate Total Requested (Pending or Approved)
        const payoutRequests = await PayoutRequest.find({ 
            vendorId, 
            status: { $in: ['Pending', 'Approved'] } 
        });
        const totalRequested = payoutRequests.reduce((sum, request) => sum + (request.amount || 0), 0);

        // 3. Check Available Balance
        const availableBalance = totalEarned - totalRequested;

        if (amount > availableBalance) {
            return res.status(400).json({ 
                message: `Insufficient balance. Available: Rs. ${availableBalance}`, 
                success: false 
            });
        }

        const newPayout = new PayoutRequest({
            vendorId,
            amount,
            bankDetails: {
                accountName: bankDetails.accountName,
                accountNumber: bankDetails.accountNumber,
                bankName: bankDetails.bankName,
                branch: bankDetails.branch
            }
        });

        await newPayout.save();

        res.status(201).json({
            message: 'Payout request submitted successfully. Admin will review it.',
            success: true,
            payout: newPayout
        });
    } catch (err) {
        console.error('Error submitting payout request:', err);
        res.status(500).json({ message: 'Server error submitting payout request', success: false });
    }
};

const getVendorPayouts = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const payouts = await PayoutRequest.find({ vendorId }).sort({ requestDate: -1 });
        res.status(200).json(payouts);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching payouts', success: false });
    }
};

const getAllPayoutsAdmin = async (req, res) => {
    try {
        const payouts = await PayoutRequest.find()
            .populate('vendorId', 'name email shopName shopLogo')
            .sort({ requestDate: -1 });
        res.status(200).json(payouts);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching payouts for admin', success: false });
    }
};

const updatePayoutStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status', success: false });
        }

        const payout = await PayoutRequest.findById(id);
        if (!payout) {
            return res.status(404).json({ message: 'Payout request not found', success: false });
        }

        payout.status = status;
        if (status === 'Approved') {
            payout.payoutDate = Date.now();
        }

        await payout.save();

        res.status(200).json({
            message: `Payout request ${status.toLowerCase()}`,
            success: true,
            payout
        });
    } catch (err) {
        console.error('Error updating payout status:', err);
        res.status(500).json({ message: 'Server error updating payout status', success: false });
    }
};

module.exports = {
    requestPayout,
    getVendorPayouts,
    getAllPayoutsAdmin,
    updatePayoutStatus
};
