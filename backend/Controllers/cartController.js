const Cart = require("../Models/cart");
const Wishlist = require("../Models/wishlist");


const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate({
            path: 'items.productId',
            populate: { path: 'vendor', select: 'name isVendorApproved' }
        });
        
        if (!cart) {
            return res.status(200).json([]);
        }
        
        // Filter out items where product might have been deleted
        const cartItems = cart.items.filter(item => item.productId !== null);
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching cart", success: false });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ userId: req.user._id });
        
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }
        
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += 1;
        } else {
            cart.items.push({ productId: productId, quantity: 1 });
        }
        
        cart.updatedAt = Date.now();
        await cart.save();
        res.status(200).json({ message: "Item added to cart", success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error adding to cart", success: false });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ userId: req.user._id });
        
        if (cart) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            cart.updatedAt = Date.now();
            await cart.save();
        }
        
        res.status(200).json({ message: "Item removed from cart", success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error removing from cart", success: false });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1", success: false });
        }
        
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            cart.updatedAt = Date.now();
            await cart.save();
            res.status(200).json({ message: "Quantity updated", success: true });
        } else {
            res.status(404).json({ message: "Item not found in cart", success: false });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error updating quantity", success: false });
    }
};

const moveToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        // 1. Remove from Cart
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            cart.updatedAt = Date.now();
            await cart.save();
        }

        // 2. Add to Wishlist
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }
        
        const alreadyInWishlist = wishlist.products.some(item => item.productId.toString() === productId);
        if (!alreadyInWishlist) {
            wishlist.products.push({ productId });
            await wishlist.save();
        }

        res.status(200).json({ message: "Item moved to wishlist", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error moving item to wishlist", success: false });
    }
};


module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    moveToWishlist
};
