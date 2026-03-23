const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateQuantity } = require("../Controllers/cartController");
const { ensureAuthenticated } = require("../Middlewares/AuthValidation");

router.get("/", ensureAuthenticated, getCart);
router.post("/add", ensureAuthenticated, addToCart);
router.delete("/remove/:productId", ensureAuthenticated, removeFromCart);
router.put("/update", ensureAuthenticated, updateQuantity);

module.exports = router;
