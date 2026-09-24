import ProductModel from "../models/product.js";

// Initial seed products for rich marketplace experience if DB is empty
const defaultProducts = [
    {
        title: "Wholesale Cotton Crew Neck T-Shirts (Lot of 100)",
        category: "apparel",
        categoryLabel: "Apparel & Garments",
        price: 185,
        mrp: 399,
        moq: 100,
        unit: "pcs",
        stock: 5000,
        leadTime: "3-5 Days",
        badge: "Bestseller",
        description: "100% Bio-washed combed cotton, 180 GSM, pre-shrunk, ideal for corporate branding and bulk printing.",
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"]
    },
    {
        title: "Premium Pique Polo Shirts (Bulk Lots)",
        category: "apparel",
        categoryLabel: "Apparel & Garments",
        price: 260,
        mrp: 599,
        moq: 50,
        unit: "pcs",
        stock: 3500,
        leadTime: "5-7 Days",
        badge: "Verified Vendor",
        description: "220 GSM breathable honeycomb pique fabric. Contrast ribbed collar and cuffs, dual horn button placket.",
        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80"]
    },
    {
        title: "Heavy-Duty Canvas Laptop Backpacks",
        category: "bags",
        categoryLabel: "Bags & Luggage",
        price: 490,
        mrp: 1299,
        moq: 30,
        unit: "pcs",
        stock: 1200,
        leadTime: "4-6 Days",
        badge: "Wholesale Hot",
        description: "Water-resistant 600D ballistic polyester with padded 15.6 inch laptop sleeve, USB charging port, and metal zippers.",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"]
    },
    {
        title: "Double-Wall Insulated Stainless Steel Flask (750ml)",
        category: "drinkware",
        categoryLabel: "Drinkware",
        price: 320,
        mrp: 799,
        moq: 50,
        unit: "pcs",
        stock: 2000,
        leadTime: "3-5 Days",
        badge: "Ready Stock",
        description: "Food grade 304 stainless steel. Keeps drinks cold for 24h, hot for 12h. Matte powder coating.",
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"]
    },
    {
        title: "Executive PU Leather Notebook & Metal Pen Set",
        category: "stationery",
        categoryLabel: "Corporate Gifts",
        price: 210,
        mrp: 499,
        moq: 50,
        unit: "sets",
        stock: 4000,
        leadTime: "3-4 Days",
        badge: "Popular Gift",
        description: "A5 Hardcover diary with bookmark ribbon, elastic closure loop, 192 lined 80 GSM acid-free ivory pages.",
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80"]
    },
    {
        title: "Steel Toe Industrial Safety Boots (CE Approved)",
        category: "footwear",
        categoryLabel: "Footwear & Safety",
        price: 650,
        mrp: 1499,
        moq: 20,
        unit: "pairs",
        stock: 1500,
        leadTime: "4-7 Days",
        badge: "ISI Certified",
        description: "Genuine buff grain leather with 200J impact steel toe cap, oil & acid resistant PU double density sole.",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"]
    }
];

// Public: Get all active products
async function getPublicProducts(req, res) {
    try {
        const { category, search } = req.query;
        let query = { isActive: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { categoryLabel: { $regex: search, $options: 'i' } }
            ];
        }

        let products = await ProductModel.find(query).sort({ isFeatured: -1, createdAt: -1 });

        // Auto-seed demo products if completely empty
        if (products.length === 0 && !search && (!category || category === 'all')) {
            const adminUser = req.user || null;
            const seedItems = defaultProducts.map(p => ({
                ...p,
                seller: adminUser ? adminUser._id : "650000000000000000000001",
                sellerName: "RealBell Official Wholesaler",
                shopName: "Verified Mega Hub"
            }));
            try {
                await ProductModel.insertMany(seedItems);
                products = await ProductModel.find(query).sort({ createdAt: -1 });
            } catch (seedErr) {
                console.log("Seed note:", seedErr);
            }
        }

        return res.send({ status: 1, products });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to fetch products" });
    }
}

// Public: Get single product by ID
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) return res.send({ status: 9, msg: "Product not found" });
        return res.send({ status: 1, product });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to fetch product" });
    }
}

// Seller: Get all products created by this seller
async function getSellerProducts(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const products = await ProductModel.find({ seller: req.user._id }).sort({ createdAt: -1 });
        return res.send({ status: 1, products });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to fetch seller products" });
    }
}

// Seller: Add a new product
async function createProduct(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        if (req.user.role !== 'seller' && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.send({ status: 403, msg: "Only approved sellers or admins can list products" });
        }
        if (req.user.role === 'seller' && req.user.sellerStatus !== 'approved') {
            return res.send({ status: 403, msg: "Your seller account is awaiting admin approval" });
        }

        const {
            title,
            description,
            category,
            categoryLabel,
            price,
            mrp,
            moq,
            unit,
            stock,
            leadTime,
            badge,
            images
        } = req.body;

        if (!title || !price || !category) {
            return res.send({ status: 7, msg: "Title, Price, and Category are required" });
        }

        const newProduct = new ProductModel({
            seller: req.user._id,
            sellerName: req.user.name,
            shopName: req.user.sellerDetails?.shopName || req.user.name,
            title,
            description: description || "",
            category,
            categoryLabel: categoryLabel || category,
            price: Number(price),
            mrp: mrp ? Number(mrp) : Number(price) * 1.5,
            moq: moq ? Number(moq) : 10,
            unit: unit || "pcs",
            stock: stock ? Number(stock) : 100,
            leadTime: leadTime || "3-5 Days",
            badge: badge || "Wholesale",
            images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"],
            isActive: true
        });

        await newProduct.save();
        return res.send({ status: 1, msg: "Product listed successfully!", product: newProduct });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to create product" });
    }
}

// Seller: Update product
async function updateProduct(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) return res.send({ status: 9, msg: "Product not found" });

        // Ensure owner or admin
        const isOwner = String(product.seller) === String(req.user._id);
        const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
        if (!isOwner && !isAdmin) {
            return res.send({ status: 403, msg: "Permission denied" });
        }

        const fields = [
            'title', 'description', 'category', 'categoryLabel', 'price',
            'mrp', 'moq', 'unit', 'stock', 'leadTime', 'badge', 'images', 'isActive'
        ];
        fields.forEach(f => {
            if (req.body[f] !== undefined) product[f] = req.body[f];
        });

        await product.save();
        return res.send({ status: 1, msg: "Product updated successfully", product });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to update product" });
    }
}

// Seller: Delete product
async function deleteProduct(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) return res.send({ status: 9, msg: "Product not found" });

        const isOwner = String(product.seller) === String(req.user._id);
        const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
        if (!isOwner && !isAdmin) {
            return res.send({ status: 403, msg: "Permission denied" });
        }

        await ProductModel.findByIdAndDelete(id);
        return res.send({ status: 1, msg: "Product deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to delete product" });
    }
}

// Admin: Get all products
async function adminGetAllProducts(req, res) {
    try {
        const products = await ProductModel.find().populate('seller', 'name email sellerDetails').sort({ createdAt: -1 });
        return res.send({ status: 1, products });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to fetch all products" });
    }
}

export {
    getPublicProducts,
    getProductById,
    getSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    adminGetAllProducts
};
