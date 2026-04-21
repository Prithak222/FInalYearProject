const express = require('express');
const router = express.Router();
const Report = require('../Models/Report');
const { ensureAuthenticated, adminOnly } = require('../Middlewares/AuthValidation');

// 📝 Submit a new report (Users)
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const { subject, description } = req.body;
        const newReport = new Report({
            userId: req.user._id,
            subject,
            description
        });
        await newReport.save();
        res.status(201).json({ 
            message: 'Report submitted successfully!', 
            success: true,
            report: newReport 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', success: false });
    }
});

// 📋 Get all reports (Admin only)
router.get('/admin/all', adminOnly, async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('userId', 'name email image')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: 'Server error', success: false });
    }
});

// 🛡️ Update report status (Admin only)
router.put('/admin/:id', adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!report) {
            return res.status(404).json({ message: 'Report not found', success: false });
        }
        res.json({ message: `Report status updated to ${status}`, success: true, report });
    } catch (err) {
        res.status(500).json({ message: 'Server error', success: false });
    }
});

module.exports = router;
