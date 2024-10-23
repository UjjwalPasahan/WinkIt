import mongoose from "mongoose"
import dotenv from "dotenv";
import { categories, products } from "./seedData.js";
import { Category, Product } from "./src/models/index.js";

dotenv.config();

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)

        const categoryDocs = await Category.insertMany(categories);

        // Create a map of category names to IDs
        const categoryMap = categoryDocs.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});

        // Map products to include category IDs
        const productWithCategoryIds = products.map((product) => ({
            ...product,
            category: categoryMap[product.category],
        }));

        // Insert products with category references
        await Product.insertMany(productWithCategoryIds);

        console.log("DB seeded successfully");

    } catch (error) {
        console.log(error)
    } finally{
        mongoose.connection.close()
    }
}

seedDB()
