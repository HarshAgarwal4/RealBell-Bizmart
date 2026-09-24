import express from 'express';
import {
    getPublicProducts,
    getProductById,
    getSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    adminGetAllProducts
} from '../controllers/product.js';
import { requireRole } from '../../middlewares/Auth.js';

const productRoutes = express.Router();

// Public routes
productRoutes.get('/products', getPublicProducts);
productRoutes.get('/products/:id', getProductById);

// Seller routes
productRoutes.get('/seller/products', requireRole(['seller', 'admin', 'super_admin']), getSellerProducts);
productRoutes.post('/seller/products', requireRole(['seller', 'admin', 'super_admin']), createProduct);
productRoutes.put('/seller/products/:id', requireRole(['seller', 'admin', 'super_admin']), updateProduct);
productRoutes.delete('/seller/products/:id', requireRole(['seller', 'admin', 'super_admin']), deleteProduct);

// Admin routes
productRoutes.get('/admin/products', requireRole(['admin', 'super_admin']), adminGetAllProducts);

export { productRoutes };
