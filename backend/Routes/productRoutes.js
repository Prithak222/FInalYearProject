const express = require("express");
const router = express.Router();
const Product = require("../Models/products");
const Order = require("../Models/Order");

const { ensureAuthenticated, vendorApprovedOnly, adminOnly } = require('../Middlewares/AuthValidation');

// ➕ Add a new product (Vendor only)
router.post('/', ensureAuthenticated, vendorApprovedOnly, async (req, res) => {
  try {
    const {
      title,
      price,
      originalPrice,
      category,
      condition,
      description,
      location,
      image,
      images,
      quantity
    } = req.body;

    const newProduct = new Product({
      title,
      price,
      originalPrice,
      category,
      condition,
      description,
      location,
      image,
      images,
      quantity: quantity || 1,
      vendor: req.user._id // Link the product to the vendor
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product listed successfully!',
      product: newProduct,
      success: true
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error', error: err.message, success: false });
  }
});

// 📋 Get current vendor's products
router.get("/vendor", ensureAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id }).populate('category', 'name icon').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching vendor products" });
  }
});

// 📊 Get current vendor's stats
router.get("/vendor/stats", ensureAuthenticated, async (req, res) => {
  try {
    const vendorId = req.user._id;
    const products = await Product.find({ vendor: vendorId });
    
    // Calculate product-related stats
    const productStats = products.reduce((acc, curr) => {
      acc.totalViews += (curr.views || 0);
      acc.wishlistSaves += (curr.wishlistCount || 0);
      return acc;
    }, { totalViews: 0, wishlistSaves: 0 });

    // Calculate sales-related stats from completed orders
    const orders = await Order.find({ vendorId, paymentStatus: 'Completed' });
    
    const salesStats = orders.reduce((acc, order) => {
      acc.totalSales += order.totalAmount;
      acc.totalEarnings += order.vendorEarning;
      return acc;
    }, { totalSales: 0, totalEarnings: 0 });

    res.json({
      activeListings: products.length,
      totalViews: productStats.totalViews,
      wishlistSaves: productStats.wishlistSaves,
      totalSales: salesStats.totalSales,
      totalEarnings: salesStats.totalEarnings,
      messages: 0 // Placeholder until messaging is implemented
    });
  } catch (err) {
    console.error("Error fetching vendor stats:", err);
    res.status(500).json({ message: "Server error fetching vendor stats" });
  }
});

// 📋 Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('vendor', 'name email shopName shopLogo shopDescription').populate('category', 'name icon');

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching product", success: false });
  }
});

// 📝 Update a product (Vendor only, owner only)
router.put('/:id', ensureAuthenticated, vendorApprovedOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    // Check ownership
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own products', success: false });
    }

    const {
      title,
      price,
      originalPrice,
      category,
      condition,
      description,
      location,
      image,
      images,
      status,
      quantity
    } = req.body;

    product.title = title || product.title;
    product.price = price || product.price;
    product.originalPrice = originalPrice || product.originalPrice;
    product.category = category || product.category;
    product.condition = condition || product.condition;
    product.description = description || product.description;
    product.location = location || product.location;
    product.image = image || product.image;
    product.images = images || product.images;
    product.status = status || product.status;
    product.quantity = quantity || product.quantity;

    await product.save();

    res.json({
      message: 'Product updated successfully!',
      product,
      success: true
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error', error: err.message, success: false });
  }
});

// 🗑️ Delete a product (Vendor only, owner only)
router.delete('/:id', ensureAuthenticated, vendorApprovedOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    // Check ownership
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own products', success: false });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Product deleted successfully!',
      success: true
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error', error: err.message, success: false });
  }
});

// 🔍 Get all products with filters (Public)
router.get("/", async (req, res) => {
  try {
    const { minPrice, maxPrice, condition, category, vendor, search } = req.query;

    let filter = { $or: [{ status: 'active' }, { status: { $exists: false } }] };

    // Vendor filter
    if (vendor) {
      filter.vendor = vendor;
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Condition filter
    if (condition) {
      filter.condition = { $in: condition.split(",") };
    }

    // Category filter
    if (category) {
      filter.category = { $in: category.split(",") };
    }

    // Keyword search filter
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).populate('vendor', 'name shopName shopLogo').populate('category', 'name icon');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 📋 Get all products (Admin only)
router.get("/admin/all", adminOnly, async (req, res) => {
  try {
    const products = await Product.find().populate('vendor', 'name shopName email').populate('category', 'name icon').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching all products" });
  }
});

// 🛡️ Update product status (Admin only)
router.put("/admin/status/:id", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'pending', 'sold', 'flagged'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: `Product status updated to ${status}`, product, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error updating product status" });
  }
});

module.exports = router;

