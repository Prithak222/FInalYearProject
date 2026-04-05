const express = require('express');
const router = express.Router();
const { requestPayout, getVendorPayouts, getAllPayoutsAdmin, updatePayoutStatus } = require('../Controllers/payoutController');
const { ensureAuthenticated, adminOnly } = require('../Middlewares/AuthValidation');

// ➕ Request a payout (Vendor only)
router.post('/request', ensureAuthenticated, requestPayout);

// 📋 Get vendor's own payout history (Vendor only)
router.get('/my-payouts', ensureAuthenticated, getVendorPayouts);

// 🛡️ Get all payout requests (Admin only)
router.get('/admin/all', adminOnly, getAllPayoutsAdmin);

// 🛡️ Update payout status (Admin only)
router.put('/admin/:id', adminOnly, updatePayoutStatus);

module.exports = router;
