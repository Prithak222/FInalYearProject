const Wishlist = require("../Models/wishlist");

const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate({
            path: 'products.productId',
            populate: { path: 'vendor', select: 'name isVendorApproved' }
        });
        
        if (!wishlist) {
            return res.status(200).json([]);
        }
        
        // Filter out null products (deleted)
        const wishlistItems = wishlist.products.filter(item => item.productId !== null);
        res.status(200).json(wishlistItems);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching wishlist", success: false });
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user._id, products: [] });
        }
        
        const index = wishlist.products.findIndex(item => item.productId.toString() === productId);
        let wishlisted = false;
        
        if (index > -1) {
            wishlist.products.splice(index, 1);
        } else {
            wishlist.products.push({ productId: productId });
            wishlisted = true;
        }
        
        await wishlist.save();
        res.status(200).json({ 
            message: wishlisted ? "Item added to wishlist" : "Item removed from wishlist", 
            wishlisted,
            success: true 
        });
    } catch (err) {
        res.status(500).json({ message: "Server error toggling wishlist", success: false });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        
        if (wishlist) {
            wishlist.products = wishlist.products.filter(item => item.productId.toString() !== productId);
            await wishlist.save();
        }
        
        res.status(200).json({ message: "Item removed from wishlist", success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error removing from wishlist", success: false });
    }
};

module.exports = {
    getWishlist,
    toggleWishlist,
    removeFromWishlist
};
