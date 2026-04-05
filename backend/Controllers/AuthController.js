const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");
const crypto = require("crypto");
const ProductModel = require("../Models/products");
const transporter = require("../Utils/emailConfig");

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

  // Send Approval Email
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vendor.email,
      subject: "Welcome to DosroDeal! Your Vendor Account is Approved",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #22c55e; text-align: center;">Congratulations!</h2>
          <p>Hi ${vendor.name},</p>
          <p>We are excited to inform you that your registration as a vendor on <strong>DosroDeal</strong> has been approved!</p>
          <p>You can now log in to your vendor dashboard to start listing your products and managing your shop.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/vendor/login" style="background-color: #22c55e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 DosroDeal. All rights reserved.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (emailErr) {
    console.error("Failed to send approval email:", emailErr);
  }

  res.json({ message: 'Vendor approved and notified via email' })
}

const declineVendor = async (req, res) => {
  const vendor = await UserModel.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  const vendorEmail = vendor.email;
  const vendorName = vendor.name;

  // Send Decline Email
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vendorEmail,
      subject: "Update on Your DosroDeal Vendor Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #ef4444; text-align: center;">Vendor Registration Update</h2>
          <p>Hi ${vendorName},</p>
          <p>Thank you for your interest in selling on <strong>DosroDeal</strong>.</p>
          <p>After reviewing your application, we regret to inform you that your vendor registration was not approved at this time.</p>
          <p>We appreciate your time and effort in applying to join our platform.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 DosroDeal. All rights reserved.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (emailErr) {
    console.error("Failed to send decline email:", emailErr);
  }

  await UserModel.findByIdAndDelete(req.params.id)
  res.json({ message: 'Vendor declined and removed' })
}

const removeVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await UserModel.findById(id);

    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const vendorEmail = vendor.email;
    const vendorName = vendor.name;

    // 1. Send Account Removal Email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: vendorEmail,
        subject: "Your DosroDeal Vendor Account has been Removed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #ef4444; text-align: center;">Account Terminated</h2>
            <p>Hi ${vendorName},</p>
            <p>We are writing to inform you that your vendor account on <strong>DosroDeal</strong> has been removed by the administration.</p>
            <p>Consequently, all your listed products have been taken down and your access to the vendor portal has been revoked.</p>
            <p>If you believe this was an error, please contact our support team.</p>
            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 DosroDeal. All rights reserved.</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Failed to send removal email:", emailErr);
    }

    // 2. Delete all products of this vendor
    await ProductModel.deleteMany({ vendorId: id });

    // 3. Delete vendor user record
    await UserModel.findByIdAndDelete(id);

    res.json({ message: 'Vendor and associated products removed successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

const getPublicUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select('name image role shopName shopLogo');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 600000; // 10 minutes

    user.resetOTP = otp;
    user.resetOTPExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Password Reset - DosroDeal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">DosroDeal Password Reset</h2>
          <p>Hi ${user.name},</p>
          <p>Your One-Time Password (OTP) for resetting your password is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; padding: 10px 20px; border: 1px dashed #ccc; border-radius: 5px;">${otp}</span>
          </div>
          <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 DosroDeal. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP", success: false });
    }

    res.status(200).json({ message: "OTP verified successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await UserModel.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP", success: false });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  signup,
  login,
  vendorRegister,
  vendorLogin,
  adminLogin,
  getPendingVendors,
  approveVendor,
  declineVendor,
  getCurrentUser,
  getPublicVendor,
  getPublicUser,
  getAdminStats,
  getAllVendors,
  getVendorStats,
  getAllUsers,
  getUserStats,
  suspendUser,
  removeVendor,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
};