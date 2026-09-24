import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sellerName: {
        type: String,
        default: ""
    },
    shopName: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    categoryLabel: {
        type: String,
        default: "Wholesale"
    },
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        default: 0
    },
    moq: {
        type: Number,
        default: 10
    },
    unit: {
        type: String,
        default: "pcs"
    },
    stock: {
        type: Number,
        default: 100
    },
    leadTime: {
        type: String,
        default: "3-5 Days"
    },
    badge: {
        type: String,
        default: "Wholesale"
    },
    images: {
        type: [String],
        default: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
