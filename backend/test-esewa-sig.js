require('dotenv').config();
const { generateSignature } = require('./Utils/esewa');

// Example from documentation:
// total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST
// Secret Key: 8gBm/:&EnhH.1/q
// Should match the documentation example's signature output if possible.

const testSignature = () => {
    process.env.ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q'; 
    const message = 'total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST';
    const sig = generateSignature(message);
    console.log("Message:", message);
    console.log("Signature:", sig);
    
    // In eSewa documentation, for this specific message and secret, the signature would be something specific.
    // Since I don't have the expected output string handily as a constant, I'll just check if it's a valid Base64 string.
    const isBase64 = (str) => {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    };
    // Note: Node.js atob/btoa might need Buffer
    const isBase64Node = (str) => {
        return Buffer.from(str, 'base64').toString('base64') === str;
    };
    
    console.log("Is Base64:", isBase64Node(sig));
};

testSignature();
