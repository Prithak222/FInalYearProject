const Order = require("../Models/Order");
const Cart = require("../Models/cart");
const Payment = require("../Models/Payment");
const { generateSignature, verifyEsewaStatus } = require("../Utils/esewa");

const initializeEsewa = async (req, res) => {
    try {
        const { shippingInfo, items, totalAmount } = req.body;
        const userId = req.user._id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order", success: false });
        }

        // Generate a unique transaction UUID for this checkout session
        const transactionUuid = `${Date.now()}-${userId}`;

        // Group items by vendorId
        const vendorGroups = items.reduce((groups, item) => {
            // Support both string vendorId and populated vendor object
            const vId = item.vendorId?._id || item.vendorId;
            const vIdStr = vId.toString();
            
            if (!groups[vIdStr]) {
                groups[vIdStr] = [];
            }
            groups[vIdStr].push(item);
            return groups;
        }, {});

        const orderIds = [];
        
        // Create an order for each vendor
        for (const vIdStr in vendorGroups) {
            const vendorItems = vendorGroups[vIdStr];
            const vendorTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Calculate commission (5%) and vendor earning (95%)
            const commission = vendorTotal * 0.05;
            const vendorEarning = vendorTotal - commission;

            const newOrder = new Order({
                userId,
                vendorId: vIdStr,
                items: vendorItems.map(item => ({
                    ...item,
                    vendorId: vIdStr // Ensure the item's vendorId is also a string
                })),
                shippingInfo,
                totalAmount: vendorTotal,
                commission,
                vendorEarning,
                paymentStatus: 'Pending',
                orderStatus: 'Pending',
                transactionUuid
            });

            const savedOrder = await newOrder.save();
            orderIds.push(savedOrder._id);
        }

        // Prepare data for eSewa (Total amount for the whole cart)
        const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
        const signature = generateSignature(signatureMessage);

        const esewaData = {
            amount: totalAmount,
            tax_amount: 0,
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
            product_code: process.env.ESEWA_PRODUCT_CODE,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: process.env.ESEWA_SUCCESS_URL,
            failure_url: process.env.ESEWA_FAILURE_URL,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: signature
        };

        res.status(201).json({
            message: "Payment initialized",
            success: true,
            esewaData,
            orderIds, // Return all order IDs
            gatewayUrl: process.env.ESEWA_GATEWAY_URL
        });
    } catch (err) {
        console.error("Error initializing payment:", err);
        res.status(500).json({ message: "Server error initializing payment", success: false });
    }
};

const completePayment = async (req, res) => {
    try {
        const { data } = req.query;
        if (!data) {
            return res.status(400).send("Invalid request");
        }

        // Decode Base64 data from eSewa
        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
        const { transaction_code, status, total_amount, transaction_uuid, product_code, signature, signed_field_names } = decodedData;

        // Verify Signature
        const signatureMessage = signed_field_names.split(',').map(field => `${field}=${decodedData[field]}`).join(',');
        const expectedSignature = generateSignature(signatureMessage);

        if (signature !== expectedSignature) {
            console.error("Signature mismatch");
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
        }

        // Verify with eSewa Status API
        const verificationResponse = await verifyEsewaStatus(total_amount, transaction_uuid);
        if (!verificationResponse || verificationResponse.status !== "COMPLETE") {
            console.error("Transaction not complete or verification failed");
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
        }

        // Update ALL orders belonging to this transaction
        const updateResult = await Order.updateMany(
            { transactionUuid: transaction_uuid },
            { 
                paymentStatus: 'Completed',
                esewaTransactionCode: transaction_code
            }
        );

        console.log(`Updated ${updateResult.modifiedCount} orders for transaction ${transaction_uuid}`);

        // Find one of the orders to get the userId for cart clearing
        const sampleOrder = await Order.findOne({ transactionUuid: transaction_uuid });
        
        if (!sampleOrder) {
            return res.status(404).send("Orders not found after update");
        }

        // Clear Cart
        await Cart.findOneAndDelete({ userId: sampleOrder.userId });

        // Save detailed record to the dedicated Payment collection
        const totalAmountNum = Number(total_amount);
        const orderIds = await Order.find({ transactionUuid: transaction_uuid }).distinct('_id');
        
        const newPaymentRecord = new Payment({
            userId: sampleOrder.userId,
            orderIds,
            transactionUuid: transaction_uuid,
            transactionCode: transaction_code,
            amount: totalAmountNum,
            status: 'Completed',
            paymentMethod: 'eSewa'
        });

        await newPaymentRecord.save();
        console.log(`Successfully saved payment record for transaction ${transaction_uuid}`);

        // Redirect to success page (optionally pass the transaction UUID or just a generic success)
        res.redirect(`${process.env.FRONTEND_URL}/order-success?transactionId=${transaction_uuid}`);
    } catch (err) {
        console.error("Error completing payment:", err);
        res.status(500).send("Server error");
    }
};

const failedPayment = async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};

const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        // Fetch from the dedicated Payment collection
        const payments = await Payment.find({ userId, status: 'Completed' })
            .populate({
                path: 'orderIds',
                populate: {
                    path: 'items',
                    select: 'title image price quantity'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            payments: payments
        });
    } catch (err) {
        console.error("Error fetching payment history from collection:", err);
        res.status(500).json({ message: "Server error fetching payment history", success: false });
    }
};

module.exports = {
    initializeEsewa,
    completePayment,
    failedPayment,
    getPaymentHistory
};
