import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";
import 'dotenv/config';

const categories = [
    { name: "Salad", description: "Fresh and healthy salads", image: "menu_1.png" },
    { name: "Rolls", description: "Delicious rolls and wraps", image: "menu_2.png" },
    { name: "Deserts", description: "Sweet treats and desserts", image: "menu_3.png" },
    { name: "Sandwich", description: "Tasty sandwiches", image: "menu_4.png" },
    { name: "Cake", description: "Cakes for every occasion", image: "menu_5.png" },
    { name: "Pure Veg", description: "Pure vegetarian dishes", image: "menu_6.png" },
    { name: "Pasta", description: "Italian pasta dishes", image: "menu_7.png" },
    { name: "Noodles", description: "Asian noodles", image: "menu_8.png" }
];

const seedCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected");

        // Check if categories already exist
        const existingCategories = await categoryModel.find({});
        if (existingCategories.length > 0) {
            console.log("Categories already exist. Skipping seed.");
            process.exit(0);
        }

        // Insert categories
        await categoryModel.insertMany(categories);
        console.log("Categories seeded successfully!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
};

seedCategories();
