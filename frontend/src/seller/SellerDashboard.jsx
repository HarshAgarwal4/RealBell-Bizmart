import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../zustand/store';
import axios from '../services/axios';
import { SellerApprovalForm } from './SellerApprovalForm';
import { SellerPendingApproval } from './SellerPendingApproval';
import { SellerProducts } from './SellerProducts';
import { SellerOrders } from './SellerOrders';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Truck, 
  BarChart3, 
  CheckCircle2, 
  LogOut, 
  Building2, 
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SellerDashboard = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const logoutUser = useStore(state => state.logoutUser);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'
  const [forceForm, setForceForm] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingShipments: 0
  });

  useEffect(() => {
    if (user?.sellerStatus === 'approved') {
      fetchSellerMetrics();
    }
  }, [user]);

  const fetchSellerMetrics = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        axios.get('/seller/products'),
        axios.get('/seller/orders')
      ]);

      const prods = prodRes.data.products || [];
      const orders = orderRes.data.orders || [];

      const totalRevenue = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

      const pendingShipments = orders.filter(o => 
        ['confirmed', 'processing', 'shipped'].includes(o.orderStatus)
      ).length;

      setMetrics({
        totalProducts: prods.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingShipments
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // If user has not filled approval form yet
  if (!user || user.sellerStatus === 'none' || forceForm) {
    return <SellerApprovalForm />;
  }

  // If user is pending or rejected
  if (user.sellerStatus === 'pending' || user.sellerStatus === 'rejected') {
    return <SellerPendingApproval onReapply={() => setForceForm(true)} />;
  }

  // Approved Seller Dashboard
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-poppins">
      
      {/* Top Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="RealBell" className="h-8 w-auto bg-white/10 p-0.5 rounded-lg" />
              <div className="flex items-center">
                <span className="font-bold text-base text-slate-900 dark:text-white">RealBell</span>
                <span className="font-bold text-base text-amber-500">BizMart</span>
              </div>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full text-xs font-bold">
              <Store className="w-3.5 h-3.5 text-amber-500" />
              <span>Seller Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                {user?.sellerDetails?.shopName || user?.name}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Verified Wholesaler</span>
              </span>
            </div>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-amber-500 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Shop Overview Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/60 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Approved Supplier
              </span>
              <span className="text-xs text-slate-400 font-mono">
                GST: {user?.sellerDetails?.gstNumber || 'Verified'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {user?.sellerDetails?.shopName || 'Wholesale Supplier Store'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Category: <span className="capitalize font-semibold text-amber-400">{user?.sellerDetails?.businessCategory || 'General Merchandise'}</span> • Location: {user?.sellerDetails?.city || 'India'}
            </p>
          </div>

          {/* Quick tab switcher pills */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Catalog Products</span>
                  <Package className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalProducts}</div>
                <div className="text-[11px] text-slate-400 mt-1">Active wholesale listings</div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.totalOrders}</div>
                <div className="text-[11px] text-slate-400 mt-1">Direct commercial bookings</div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Pending Shipments</span>
                  <Truck className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{metrics.pendingShipments}</div>
                <div className="text-[11px] text-slate-400 mt-1">Requires dispatch</div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Gross Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Settled via Razorpay</div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setActiveTab('products')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-3xl p-6 shadow-2xs cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  Manage Product Inventory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add new wholesale bulk listings, update MOQs, and adjust wholesale prices.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('orders')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-3xl p-6 shadow-2xs cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  Fulfill Inflow Orders
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect buyer addresses, dispatch cartons, and update live tracking status.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <SellerProducts />
        )}

        {/* Tab 3: Orders */}
        {activeTab === 'orders' && (
          <SellerOrders />
        )}

      </div>
    </div>
  );
};
