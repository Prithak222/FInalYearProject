const express = require("express");
const router = express.Router();
const { submitReview, getVendorReviews, checkOrderReview } = require("../Controllers/reviewController");
const { ensureAuthenticated } = require("../Middlewares/AuthValidation");

router.post("/", ensureAuthenticated, submitReview);
router.get("/vendor/:vendorId", getVendorReviews);
router.get("/check/:orderId", ensureAuthenticated, checkOrderReview);

module.exports = router;
