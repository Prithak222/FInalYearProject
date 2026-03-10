const express = require("express");
const router = express.Router();
const Product = require("../Models/products");

const { ensureAuthenticated, vendorApprovedOnly } = require('../Middlewares/AuthValidation');

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
      images
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
    const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching vendor products" });
  }
});

// 📋 Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'name email');
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
      status
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
    const { minPrice, maxPrice, condition, category } = req.query;

    let filter = { status: 'active' };

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

    const products = await Product.find(filter).populate('vendor', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
