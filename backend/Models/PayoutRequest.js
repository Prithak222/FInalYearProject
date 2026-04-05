const mongoose = require('mongoose');

const payoutRequestSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        default: 'Bank Transfer'
    },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        branch: String
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    payoutDate: {
        type: Date
    }
});

module.exports = mongoose.model('PayoutRequest', payoutRequestSchema);
