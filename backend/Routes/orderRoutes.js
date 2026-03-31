const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getVendorOrders, getAllOrdersForAdmin, updateOrderStatus } = require("../Controllers/orderController");
const { ensureAuthenticated, adminOnly } = require("../Middlewares/AuthValidation");

router.post("/", ensureAuthenticated, createOrder);
router.get("/my-orders", ensureAuthenticated, getMyOrders);
router.get("/vendor-orders", ensureAuthenticated, getVendorOrders);
router.put("/:id/status", ensureAuthenticated, updateOrderStatus);
router.get("/admin/all-orders", adminOnly, getAllOrdersForAdmin);

module.exports = router;
