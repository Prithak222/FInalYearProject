const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201)
      .json({
        message: "User registered successfully",
        success: true
      })

  } catch (err) {
    res.status(500).
      json({
        message: "Internal Server Error",
        err
      })

  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    const errorMessage = "Invalid email or password";
    if (!user) {
      return res.status(403).json({ message: errorMessage, success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: errorMessage, success: false });
    }

    //  Check for suspension
    if (user.suspendedUntil && user.suspendedUntil > new Date()) {
      return res.status(403).json({
        message: `Your account is suspended until ${user.suspendedUntil.toLocaleString()}`,
        success: false
      });
    }

    // Include role in JWT
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token,          // unified token for all roles
      email: user.email,
      name: user.name,
      userType: user.role // admin, vendor, customer
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      err
    });
  }
};


const vendorRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "vendor",
      isVendorApproved: false
    });

    await vendor.save();

    res.status(201).json({
      message: "Vendor registered successfully. Waiting for approval."
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user || user.role !== "vendor") {
      return res.status(401).json({ message: "Not a vendor" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1️⃣ Check admin exists
    const admin = await UserModel.findOne({ email, role: 'admin' })
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' })
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // 3️⃣ Generate token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // 4️⃣ Success → frontend redirects to admin dashboard
    res.json({
      message: 'Admin login successful',
      token,
      userType: admin.role // ← fix here
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getPendingVendors = async (req, res) => {
  const vendors = await UserModel.find({
    role: 'vendor',
    isVendorApproved: false
  }).select('-password')

  res.json(vendors)
}



const approveVendor = async (req, res) => {
  const vendor = await UserModel.findById(req.params.id)

  if (!vendor || vendor.role !== 'vendor') {
    return res.status(404).json({ message: 'Vendor not found' })
  }

  vendor.isVendorApproved = true
  await vendor.save()

  res.json({ message: 'Vendor approved' })
}

const declineVendor = async (req, res) => {
  await UserModel.findByIdAndDelete(req.params.id)
  res.json({ message: 'Vendor declined and removed' })
}

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}



const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments({ role: 'customer' });
    const activeVendors = await UserModel.countDocuments({ role: 'vendor', isVendorApproved: true });
    const totalProducts = await require("../Models/products").countDocuments();

    res.json({
      totalUsers,
      activeVendors,
      totalProducts,
      gmv: 0 // Default to 0 as order management is not implemented
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

const getAllVendors = async (req, res) => {
  try {
    const vendors = await UserModel.find({ role: "vendor" }).select("-password");
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getVendorStats = async (req, res) => {
  try {
    const total = await UserModel.countDocuments({ role: "vendor" });
    const verified = await UserModel.countDocuments({ role: "vendor", isVendorApproved: true });
    const pending = await UserModel.countDocuments({ role: "vendor", isVendorApproved: false });
    // Assuming 'rejected' means deleted or not in the system, but for now let's say 0
    res.json({ total, verified, pending, rejected: 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "customer" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const total = await UserModel.countDocuments({ role: "customer" });
    const suspended = await UserModel.countDocuments({
      role: "customer",
      suspendedUntil: { $gt: new Date() }
    });
    const active = total - suspended;
    res.json({ total, active, suspended });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const suspendedUntil = new Date();
    suspendedUntil.setHours(suspendedUntil.getHours() + 24);

    const user = await UserModel.findByIdAndUpdate(
      id,
      { suspendedUntil },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User suspended for 24 hours", suspendedUntil });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPublicVendor = async (req, res) => {
  try {
    const vendor = await UserModel.findById(req.params.id)
      .select('name image shopName shopDescription shopLogo shopBanner shopSlug category businessHours returnPolicy createdAt');
    
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = [
      'name', 'phone', 'address', 'image',
      'shopName', 'shopDescription', 'shopLogo', 'shopBanner', 'shopSlug', 'category', 'businessHours', 'returnPolicy',
      'bankName', 'accountHolder', 'accountNumber', 'routingNumber', 'payoutSchedule', 'payoutThreshold',
      'notifNewOrderEmail', 'notifNewOrderPush', 'domesticShipping', 'internationalShipping'
    ];

    const updateData = {};
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  signup,
  login, vendorRegister, vendorLogin, adminLogin, getPendingVendors, approveVendor, declineVendor, getCurrentUser, getPublicVendor, getAdminStats, getAllVendors, getVendorStats, getAllUsers, getUserStats, suspendUser, updateProfile
};