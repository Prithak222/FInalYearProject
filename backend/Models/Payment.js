const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    transactionUuid: {
        type: String,
        unique: true,
        required: true
    },
    transactionCode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Failed', 'Pending'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        default: 'eSewa'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
