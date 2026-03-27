const Order = require("../Models/Order");
const Cart = require("../Models/cart");
const { generateSignature, verifyEsewaStatus } = require("../Utils/esewa");

const initializeEsewa = async (req, res) => {
    try {
        const { shippingInfo, items, totalAmount } = req.body;
        const userId = req.user._id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order", success: false });
        }

        // Generate a unique transaction UUID
        const transactionUuid = `${Date.now()}-${userId}`;

        const newOrder = new Order({
            userId,
            items,
            shippingInfo,
            totalAmount,
            paymentStatus: 'Pending',
            orderStatus: 'Pending',
            transactionUuid
        });

        const savedOrder = await newOrder.save();

        // Prepare data for eSewa
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
            orderId: savedOrder._id,
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

        // Update Order
        const order = await Order.findOneAndUpdate(
            { transactionUuid: transaction_uuid },
            { 
                paymentStatus: 'Completed',
                esewaTransactionCode: transaction_code
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // Clear Cart
        await Cart.findOneAndDelete({ userId: order.userId });

        // Redirect to success page
        res.redirect(`${process.env.FRONTEND_URL}/order-success?orderId=${order._id}`);
    } catch (err) {
        console.error("Error completing payment:", err);
        res.status(500).send("Server error");
    }
};

const failedPayment = async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};

module.exports = {
    initializeEsewa,
    completePayment,
    failedPayment
};
