import express from 'express';
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    handlePaymentFailure,
    retryRazorpayOrder,
    cancelOrder,
    getUserOrders,
    getOrderDetails,
    getSellerOrders,
    updateSellerOrderStatus,
    adminGetAllOrders
} from '../controllers/orderPayment.js';
import { requireRole } from '../../middlewares/Auth.js';

const orderPaymentRoutes = express.Router();

// Razorpay Payment Gateway Endpoints
orderPaymentRoutes.post('/payment/create-order', createRazorpayOrder);
orderPaymentRoutes.post('/payment/verify-payment', verifyRazorpayPayment);
orderPaymentRoutes.post('/payment/payment-failed', handlePaymentFailure);
orderPaymentRoutes.post('/payment/retry-order', retryRazorpayOrder);

// Buyer Order Routes
orderPaymentRoutes.get('/user/orders', getUserOrders);
orderPaymentRoutes.get('/orders/:id', getOrderDetails);
orderPaymentRoutes.post('/orders/:id/cancel', cancelOrder);

// Seller Order Routes
orderPaymentRoutes.get('/seller/orders', requireRole(['seller', 'admin', 'super_admin']), getSellerOrders);
orderPaymentRoutes.post('/seller/orders/status', requireRole(['seller', 'admin', 'super_admin']), updateSellerOrderStatus);

// Admin Order Routes
orderPaymentRoutes.get('/admin/orders', requireRole(['admin', 'super_admin']), adminGetAllOrders);

export { orderPaymentRoutes };
