const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../Controllers/categoryController');
const { ensureAuthenticated, adminOnly } = require('../Middlewares/AuthValidation');

// 📋 Public route to get all categories
router.get('/', getCategories);

// 🛡️ Admin routes
router.post('/', ensureAuthenticated, adminOnly, createCategory);
router.put('/:id', ensureAuthenticated, adminOnly, updateCategory);
router.delete('/:id', ensureAuthenticated, adminOnly, deleteCategory);

module.exports = router;
