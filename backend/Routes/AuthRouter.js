const { registerValidation, loginValidation } = require("../Middlewares/AuthValidation");
const { signup, login } = require("../Controllers/AuthController");
const { vendorRegister, vendorLogin } = require("../Controllers/AuthController");
const { adminOnly } = require('../Middlewares/AuthValidation');
const router = require("express").Router();



router.post('/login', loginValidation, login);

router.post('/register', registerValidation, signup);

router.post("/vendor/register", vendorRegister);
router.post("/vendor/login", vendorLogin);

const { ensureAuthenticated } = require('../Middlewares/AuthValidation');
const { getCurrentUser } = require('../Controllers/AuthController');
router.get('/me', ensureAuthenticated, getCurrentUser);

router.get('/admin/dashboard', adminOnly, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

// Admin Vendor Management Routes
const { getPendingVendors, approveVendor, declineVendor, getAdminStats, getAllVendors, getVendorStats, getAllUsers, getUserStats } = require("../Controllers/AuthController");
router.get('/admin/vendors/pending', adminOnly, getPendingVendors);
router.put('/admin/vendors/:id/approve', adminOnly, approveVendor); // Changed to PUT as it updates state
router.delete('/admin/vendors/:id/decline', adminOnly, declineVendor);

router.get('/admin/stats', adminOnly, getAdminStats);
router.get('/admin/vendors', adminOnly, getAllVendors);
router.get('/admin/vendors/stats', adminOnly, getVendorStats);
router.get('/admin/users', adminOnly, getAllUsers);
router.get('/admin/users/stats', adminOnly, getUserStats);
const { suspendUser, updateProfile, getPublicVendor, getPublicUser } = require("../Controllers/AuthController");
router.post('/admin/users/:id/suspend', adminOnly, suspendUser);
router.put('/update-profile', ensureAuthenticated, updateProfile);
router.get('/vendor/:id', getPublicVendor);
router.get('/user/:id', getPublicUser);

const { forgotPassword, verifyOTP, resetPassword } = require("../Controllers/AuthController");
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;