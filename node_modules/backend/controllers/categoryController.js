import categoryModel from "../models/categoryModel.js";
import fs from 'fs';

// Add category
const addCategory = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image is required" });
        }

        const { name, description } = req.body;

        // Check if category already exists
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.json({ success: false, message: "Category already exists" });
        }

        const category = new categoryModel({
            name,
            description: description || "",
            image: req.file.filename
        });

        await category.save();
        res.json({ success: true, message: "Category Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// List all categories
const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json({ success: true, data: categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove category
const removeCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.body.id);
        if (category && category.image) {
            fs.unlink(`uploads/${category.image}`, () => {});
        }
        await categoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Category Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;

        // Check if new name already exists (excluding current category)
        const existingCategory = await categoryModel.findOne({ name, _id: { $ne: id } });
        if (existingCategory) {
            return res.json({ success: false, message: "Category name already exists" });
        }

        const updateData = {
            name,
            description: description || ""
        };

        // If new image is uploaded, update image field
        if (req.file) {
            // Delete old image
            const category = await categoryModel.findById(id);
            if (category && category.image) {
                fs.unlink(`uploads/${category.image}`, () => {});
            }
            updateData.image = req.file.filename;
        }

        await categoryModel.findByIdAndUpdate(id, updateData);

        res.json({ success: true, message: "Category Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addCategory, listCategory, removeCategory, updateCategory };
