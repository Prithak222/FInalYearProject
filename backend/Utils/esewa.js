const crypto = require("crypto");
const axios = require("axios");

const generateSignature = (message) => {
    const secret = process.env.ESEWA_SECRET_KEY;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);
    const hash = hmac.digest("base64");
    return hash;
};

const verifyEsewaStatus = async (totalAmount, transactionUuid) => {
    try {
        const url = `${process.env.ESEWA_STATUS_CHECK_URL}?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("eSewa verification error:", error.response ? error.response.data : error.message);
        return null;
    }
};

module.exports = {
    generateSignature,
    verifyEsewaStatus
};
