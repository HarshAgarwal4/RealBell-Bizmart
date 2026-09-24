import express from 'express';
import {
    fetchUser,
    login,
    logout,
    resetPassword,
    sendOTPToEmail,
    signUp,
    applySeller,
    adminGetSellers,
    adminApproveSeller,
    adminRejectSeller,
    adminGetUsers,
    adminUpdateRole
} from '../controllers/user.js';
import { requireRole } from '../../middlewares/Auth.js';

const userRoutes = express.Router();

userRoutes.post('/signup', signUp);
userRoutes.post('/login', login);
userRoutes.post('/sendotp', sendOTPToEmail);
userRoutes.post('/reset-password', resetPassword);
userRoutes.post('/forget-password', resetPassword);
userRoutes.post('/me', fetchUser);
userRoutes.post('/logout', logout);

// Seller application
userRoutes.post('/seller/apply', applySeller);

// Admin user and seller management
userRoutes.get('/admin/sellers', requireRole(['admin', 'super_admin']), adminGetSellers);
userRoutes.post('/admin/sellers/approve', requireRole(['admin', 'super_admin']), adminApproveSeller);
userRoutes.post('/admin/sellers/reject', requireRole(['admin', 'super_admin']), adminRejectSeller);
userRoutes.get('/admin/users', requireRole(['admin', 'super_admin']), adminGetUsers);
userRoutes.post('/admin/users/role', requireRole(['admin', 'super_admin']), adminUpdateRole);

export { userRoutes };