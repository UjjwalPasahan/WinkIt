import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required:true
    },
    discountedPrice: {
        type: Number,
    },
    quantity: {
        type: String,
        required:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
});


export const Product = mongoose.model("Product",ProductSchema);