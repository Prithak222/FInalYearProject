const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateQuantity, moveToWishlist } = require("../Controllers/cartController");
const { ensureAuthenticated } = require("../Middlewares/AuthValidation");

router.get("/", ensureAuthenticated, getCart);
router.post("/add", ensureAuthenticated, addToCart);
router.delete("/remove/:productId", ensureAuthenticated, removeFromCart);
router.post("/move-to-wishlist/:productId", ensureAuthenticated, moveToWishlist);
router.put("/update", ensureAuthenticated, updateQuantity);


module.exports = router;
