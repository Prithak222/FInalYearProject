const express = require("express");
const router = express.Router();
const { initializeEsewa, completePayment, failedPayment } = require("../Controllers/paymentController");
const { ensureAuthenticated } = require("../Middlewares/AuthValidation");

router.post("/initialize-esewa", ensureAuthenticated, initializeEsewa);
router.get("/complete-payment-esewa", completePayment);
router.get("/failed-payment-esewa", failedPayment);

module.exports = router;
