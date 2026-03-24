const Category = require('../Models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching categories", error: err.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, icon, description } = req.body;
        const newCategory = new Category({ name, icon, description });
        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        res.status(500).json({ message: "Server error creating category", error: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, icon, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, icon, description },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated", category });
    } catch (err) {
        res.status(500).json({ message: "Server error updating category", error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error deleting category", error: err.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
