import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import SignUp from '../pages/signup.jsx';
import LoginPage from '../pages/login.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import { ProtectedRoute, RoleRedirect } from './Auth.jsx';

// User / Buyer Components
import { UserDashboard } from '../user/UserDashboard.jsx';
import { UserOrders } from '../user/UserOrders.jsx';
import { OrderTracking } from '../user/OrderTracking.jsx';

// Seller Components
import { SellerDashboard } from '../seller/SellerDashboard.jsx';
import { SellerApprovalForm } from '../seller/SellerApprovalForm.jsx';

// Admin Components
import { AdminDashboard } from '../admin/AdminDashboard.jsx';
import { SellerApprovals } from '../admin/SellerApprovals.jsx';
import { AdminProducts } from '../admin/AdminProducts.jsx';
import { AdminOrders } from '../admin/AdminOrders.jsx';
import { AdminUsers } from '../admin/AdminUsers.jsx';

const Routes = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/forget-password',
    element: <ForgotPassword />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/dashboard',
    element: <RoleRedirect />
  },

  // User / Buyer Routes
  {
    path: '/user/dashboard',
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/user/orders',
    element: (
      <ProtectedRoute>
        <UserOrders />
      </ProtectedRoute>
    )
  },
  {
    path: '/user/track-order/:id',
    element: (
      <ProtectedRoute>
        <OrderTracking />
      </ProtectedRoute>
    )
  },

  // Seller Routes
  {
    path: '/seller/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['seller', 'admin', 'super_admin']}>
        <SellerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/seller/apply',
    element: (
      <ProtectedRoute>
        <SellerApprovalForm />
      </ProtectedRoute>
    )
  },

  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/sellers',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
        <SellerApprovals />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/products',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
        <AdminProducts />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/orders',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
        <AdminOrders />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
        <AdminUsers />
      </ProtectedRoute>
    )
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default Routes;