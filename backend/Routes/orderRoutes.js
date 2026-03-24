const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getVendorOrders } = require("../Controllers/orderController");
const { ensureAuthenticated } = require("../Middlewares/AuthValidation");

router.post("/", ensureAuthenticated, createOrder);
router.get("/my-orders", ensureAuthenticated, getMyOrders);
router.get("/vendor-orders", ensureAuthenticated, getVendorOrders);

module.exports = router;
