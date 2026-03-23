const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist, removeFromWishlist } = require("../Controllers/wishlistController");
const { ensureAuthenticated } = require("../Middlewares/AuthValidation");

router.get("/", ensureAuthenticated, getWishlist);
router.post("/toggle/:productId", ensureAuthenticated, toggleWishlist);
router.delete("/remove/:productId", ensureAuthenticated, removeFromWishlist);

module.exports = router;
