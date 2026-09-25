import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../zustand/store';
import axios from '../services/axios';
import { SellerApprovalForm } from './SellerApprovalForm';
import { SellerPendingApproval } from './SellerPendingApproval';
import { SellerProducts } from './SellerProducts';
import { SellerOrders } from './SellerOrders';
import { MerchantNavbar } from './MerchantNavbar';
import { MerchantFooter } from './MerchantFooter';
import { KPICardSkeleton, TableRowSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';
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
  ChevronRight,
  Clock,
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  X,
  Menu,
  PhoneCall,
  MapPin,
  FileText,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SellerDashboard = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const logoutUser = useStore(state => state.logoutUser);

  // Active Tab: 'overview' | 'products' | 'orders' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [forceForm, setForceForm] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Metrics & Recent Orders
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingShipments: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Dynamic Navbar Height Calculation for truly fixed sidebar positioning
  const [navbarHeight, setNavbarHeight] = useState(115);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navEl = document.getElementById('merchant-navbar') || document.querySelector('header');
      if (navEl) {
        setNavbarHeight(navEl.offsetHeight);
      }
    };
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isApproved = user?.sellerStatus === 'approved';

  useEffect(() => {
    if (isAdmin || isApproved) {
      fetchSellerMetrics();
    } else {
      setLoadingMetrics(false);
    }
  }, [user, isAdmin, isApproved]);

  const fetchSellerMetrics = async () => {
    try {
      setLoadingMetrics(true);
      await withSkeletonDelay();
      const [prodRes, orderRes] = await Promise.all([
        axios.get('/seller/products').catch(err => {
          console.warn("Could not fetch seller products:", err.message);
          return { data: { products: [] } };
        }),
        axios.get('/seller/orders').catch(err => {
          console.warn("Could not fetch seller orders:", err.message);
          return { data: { orders: [] } };
        })
      ]);

      const prods = prodRes?.data?.products || [];
      const orders = orderRes?.data?.orders || [];

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

      // Keep recent 5 orders for dashboard overview table
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Error in fetchSellerMetrics:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // 1. If user has not filled approval form yet
  if (!isAdmin && (!user || user.sellerStatus === 'none' || forceForm)) {
    return <SellerApprovalForm />;
  }

  // 2. If user is pending or rejected
  if (!isAdmin && (user.sellerStatus === 'pending' || user.sellerStatus === 'rejected')) {
    return <SellerPendingApproval onReapply={() => setForceForm(true)} />;
  }

  // 3. Approved Seller Dashboard
  return (
    <div className="min-h-screen bg-theme-page text-theme-main font-poppins flex flex-col selection:bg-[#F59E0B] selection:text-slate-950">
      
      {/* Merchant Top Navbar */}
      <MerchantNavbar 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        onAddProduct={() => {
          setActiveTab('products');
          setMobileSidebarOpen(false);
        }}
        pendingShipments={metrics.pendingShipments}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Container Layout */}
      <div className="flex-1 w-full relative">
        
        {/* Mobile Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[998] lg:hidden"
          />
        )}

        {/* ===================== FIXED LEFT SIDEBAR ===================== */}
        <aside 
          style={{
            top: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${navbarHeight}px` : undefined,
            height: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `calc(100vh - ${navbarHeight}px)` : undefined
          }}
          className={`fixed inset-y-0 left-0 z-[999] w-72 bg-theme-sidebar border-r border-theme-border p-4 sm:p-5 overflow-y-auto shadow-xs transition-transform duration-300 lg:top-[115px] lg:bottom-0 lg:z-30 flex flex-col justify-between ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-5">
            
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between lg:hidden pb-3 border-b border-theme-border">
              <span className="font-bold text-xs text-theme-main uppercase tracking-wider">Merchant Menu</span>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-theme-muted hover:text-theme-main cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Store Information Card */}
            <div className="p-3.5 rounded-2xl bg-theme-card border border-theme-border shadow-2xs space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {user?.sellerDetails?.shopName ? user.sellerDetails.shopName[0].toUpperCase() : 'M'}
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <h3 className="font-bold text-xs text-theme-main truncate">
                    {user?.sellerDetails?.shopName || 'Wholesale Store'}
                  </h3>
                  <p className="text-[11px] text-theme-muted truncate font-mono">
                    GST: {user?.sellerDetails?.gstNumber || 'Verified'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-theme-border/60 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Store Online</span>
                </span>
                <span className="text-theme-muted capitalize text-[10px] bg-theme-subtle px-2 py-0.5 rounded-full font-medium">
                  {user?.sellerDetails?.businessCategory || 'Wholesale'}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-theme-muted uppercase tracking-wider px-2 mb-1.5">
                Merchant Operations
              </div>

              {/* 1. Overview */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('overview');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>Overview & Analytics</span>
                </div>
              </button>

              {/* 2. Products */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Wholesale Inventory</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  activeTab === 'products' ? 'bg-slate-950 text-white' : 'bg-theme-card text-theme-muted border border-theme-border'
                }`}>
                  {metrics.totalProducts}
                </span>
              </button>

              {/* 3. Orders */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('orders');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4" />
                  <span>Commercial Orders</span>
                </div>
                {metrics.pendingShipments > 0 ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    activeTab === 'orders' ? 'bg-slate-950 text-white' : 'bg-amber-500/15 text-[#F59E0B] border border-amber-500/20'
                  }`}>
                    {metrics.pendingShipments} pending
                  </span>
                ) : (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    activeTab === 'orders' ? 'bg-slate-950 text-white' : 'bg-theme-card text-theme-muted border border-theme-border'
                  }`}>
                    {metrics.totalOrders}
                  </span>
                )}
              </button>

              {/* 4. Store Profile & GST */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4" />
                  <span>Store Profile & GST</span>
                </div>
              </button>
            </div>

            {/* Marketplace Storefront Link Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-theme-card to-theme-card border border-amber-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B]">
                <ShoppingBag className="w-4 h-4" />
                <span>Buyer Marketplace</span>
              </div>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                Inspect your live products and view customer storefront prices on the public marketplace.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/user/dashboard"
                  className="flex items-center justify-center gap-1 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border hover:border-[#F59E0B] text-theme-main font-semibold text-[11px] py-2 rounded-xl transition cursor-pointer shadow-2xs"
                  title="Switch to Normal User Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Buyer Hub</span>
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-center gap-1 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border hover:border-[#F59E0B] text-theme-main font-semibold text-[11px] py-2 rounded-xl transition cursor-pointer shadow-2xs"
                  title="Browse Live Marketplace Storefront"
                >
                  <span>Storefront</span>
                  <ExternalLink className="w-3 h-3 text-[#F59E0B]" />
                </Link>
              </div>
            </div>

          </div>

          {/* Sidebar Bottom: Sign Out */}
          <div className="pt-4 border-t border-theme-border space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Hub</span>
            </button>
          </div>

        </aside>

        {/* ===================== MAIN CONTENT WRAPPER ===================== */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Mobile Navigation Toggle Bar */}
            <div className="lg:hidden flex items-center justify-between p-3 bg-theme-card border border-theme-border rounded-2xl shadow-2xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="p-2 rounded-xl border border-theme-border bg-theme-page text-theme-main cursor-pointer"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="font-bold text-xs text-theme-main capitalize">
                  Tab: {activeTab === 'overview' ? 'Overview' : activeTab === 'products' ? 'Wholesale Products' : activeTab === 'orders' ? 'Commercial Orders' : 'Store Settings'}
                </span>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F59E0B] hover:underline"
              >
                <span>Marketplace</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* ============================================================== */}
            {/* TAB 1: OVERVIEW & ANALYTICS                                   */}
            {/* ============================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Store Header Banner */}
                <div className="bg-gradient-to-r from-theme-card via-theme-page to-amber-500/10 border border-theme-border rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Wholesaler</span>
                      </span>
                      <span className="text-xs text-theme-muted font-mono">
                        GSTIN: {user?.sellerDetails?.gstNumber || 'Active'}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-theme-main tracking-tight">
                      {user?.sellerDetails?.shopName || 'Wholesale Supplier Store'}
                    </h1>
                    <p className="text-xs sm:text-sm text-theme-muted max-w-xl">
                      Category: <span className="capitalize font-semibold text-[#F59E0B]">{user?.sellerDetails?.businessCategory || 'Wholesale Goods'}</span> • Dispatch Hub: {user?.sellerDetails?.city || 'India'}
                    </p>
                  </div>

                  {/* Header Action Buttons */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 bg-theme-card hover:bg-theme-subtle border border-theme-border text-theme-main font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                      <span>View Storefront</span>
                      <ExternalLink className="w-3 h-3 text-theme-muted" />
                    </Link>
                  </div>
                </div>

                {/* 4 Metric KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {loadingMetrics ? (
                    <KPICardSkeleton count={4} />
                  ) : (
                    <>
                      {/* Metric 1 */}
                      <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-theme-muted mb-2">
                          <span className="text-xs font-semibold">Catalog Products</span>
                          <Package className="w-4 h-4 text-[#F59E0B]" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-theme-main">{metrics.totalProducts}</div>
                        <div className="text-[11px] text-theme-muted mt-1">Active wholesale listings</div>
                      </div>

                      {/* Metric 2 */}
                      <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-theme-muted mb-2">
                          <span className="text-xs font-semibold">Commercial Orders</span>
                          <ShoppingBag className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{metrics.totalOrders}</div>
                        <div className="text-[11px] text-theme-muted mt-1">Direct enterprise bookings</div>
                      </div>

                      {/* Metric 3 */}
                      <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-theme-muted mb-2">
                          <span className="text-xs font-semibold">Pending Shipments</span>
                          <Truck className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">{metrics.pendingShipments}</div>
                        <div className="text-[11px] text-theme-muted mt-1">Requires carton dispatch</div>
                      </div>

                      {/* Metric 4 */}
                      <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-theme-muted mb-2">
                          <span className="text-xs font-semibold">Gross Settlements</span>
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                          ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-theme-muted mt-1">Settled via Razorpay</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Action Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div 
                    onClick={() => setActiveTab('products')}
                    className="bg-theme-card border border-theme-border hover:border-[#F59E0B] rounded-3xl p-5 shadow-xs cursor-pointer transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#F59E0B] flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-theme-muted group-hover:text-[#F59E0B] group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="font-bold text-sm text-theme-main mb-1">
                      Manage Wholesale Inventory
                    </h3>
                    <p className="text-xs text-theme-muted">
                      Add new listings, update MOQs, and adjust bulk pricing tiers.
                    </p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('orders')}
                    className="bg-theme-card border border-theme-border hover:border-[#F59E0B] rounded-3xl p-5 shadow-xs cursor-pointer transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-theme-muted group-hover:text-[#F59E0B] group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="font-bold text-sm text-theme-main mb-1">
                      Fulfill Inflow Orders
                    </h3>
                    <p className="text-xs text-theme-muted">
                      Inspect buyer shipping addresses, mark dispatched, and add waybills.
                    </p>
                  </div>

                  <Link 
                    to="/"
                    className="bg-theme-card border border-theme-border hover:border-[#F59E0B] rounded-3xl p-5 shadow-xs cursor-pointer transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-theme-muted group-hover:text-[#F59E0B] transition" />
                    </div>
                    <h3 className="font-bold text-sm text-theme-main mb-1">
                      Browse Public Marketplace
                    </h3>
                    <p className="text-xs text-theme-muted">
                      View live buyer listings, catalog presentation, and customer pricing.
                    </p>
                  </Link>

                </div>

                {/* Recent Inflow Commercial Orders Table */}
                <div className="bg-theme-card border border-theme-border rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-theme-main">Recent Inflow Orders</h3>
                      <p className="text-xs text-theme-muted">Latest wholesale bookings placed by verified buyers</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#F59E0B] hover:underline cursor-pointer"
                    >
                      View All Orders ({metrics.totalOrders})
                    </button>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="text-center py-10 text-theme-muted border border-dashed border-theme-border rounded-2xl">
                      <Truck className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#F59E0B]" />
                      <p className="text-xs">No customer orders received yet.</p>
                      <p className="text-[11px] text-theme-muted mt-1">Make sure you have active catalog listings with competitive wholesale MOQs.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left text-xs">
                        <thead>
                          <tr className="border-b border-theme-border text-theme-muted uppercase tracking-wider text-[10px]">
                            <th className="pb-3">Order Number</th>
                            <th className="pb-3">Buyer Details</th>
                            <th className="pb-3">Total Value</th>
                            <th className="pb-3">Payment</th>
                            <th className="pb-3">Fulfillment Status</th>
                            <th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border">
                          {loadingMetrics ? (
                            <TableRowSkeleton rows={4} cols={6} />
                          ) : (
                            recentOrders.map(order => (
                            <tr key={order._id} className="hover:bg-theme-subtle/50 transition">
                              <td className="py-3 font-mono font-semibold text-theme-main">
                                #{order.orderNumber}
                              </td>
                              <td className="py-3">
                                <div className="font-semibold text-theme-main">{order.buyerName || order.shippingAddress?.fullName}</div>
                                <div className="text-[11px] text-theme-muted">{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                              </td>
                              <td className="py-3 font-semibold text-theme-main">
                                ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.paymentStatus === 'paid' 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-amber-500/10 text-[#F59E0B] border border-amber-500/20'
                                }`}>
                                  {order.paymentStatus || 'paid'}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-semibold bg-theme-subtle text-theme-main border border-theme-border">
                                  {order.orderStatus ? order.orderStatus.replace(/_/g, ' ') : 'Processing'}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => setActiveTab('orders')}
                                  className="text-xs font-bold text-[#F59E0B] hover:underline cursor-pointer"
                                >
                                  Manage &rarr;
                                </button>
                              </td>
                            </tr>
                          )))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: WHOLESALE PRODUCTS                                      */}
            {/* ============================================================== */}
            {activeTab === 'products' && (
              <SellerProducts />
            )}

            {/* ============================================================== */}
            {/* TAB 3: COMMERCIAL ORDERS                                       */}
            {/* ============================================================== */}
            {activeTab === 'orders' && (
              <SellerOrders />
            )}

            {/* ============================================================== */}
            {/* TAB 4: STORE PROFILE & GST SETTINGS                            */}
            {/* ============================================================== */}
            {activeTab === 'settings' && (
              <div className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-lg font-bold text-theme-main flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#F59E0B]" />
                    <span>Merchant Profile & Settlement Credentials</span>
                  </h3>
                  <p className="text-xs text-theme-muted mt-1">
                    Your verified business identification and Razorpay commercial payout details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Shop Details */}
                  <div className="p-4 rounded-2xl bg-theme-page border border-theme-border space-y-3">
                    <div className="font-bold text-theme-main uppercase tracking-wider text-[11px] pb-1 border-b border-theme-border">
                      Business Identification
                    </div>
                    <div>
                      <span className="text-theme-muted block">Shop / Business Name</span>
                      <span className="font-semibold text-theme-main">{user?.sellerDetails?.shopName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">GSTIN</span>
                      <span className="font-semibold text-theme-main font-mono">{user?.sellerDetails?.gstNumber || 'Verified'}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Business Category</span>
                      <span className="font-semibold text-theme-main capitalize">{user?.sellerDetails?.businessCategory || 'Wholesale'}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Business Phone / WhatsApp</span>
                      <span className="font-semibold text-theme-main font-mono">{user?.sellerDetails?.phone || user?.phone || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Settlement & Banking Details */}
                  <div className="p-4 rounded-2xl bg-theme-page border border-theme-border space-y-3">
                    <div className="font-bold text-theme-main uppercase tracking-wider text-[11px] pb-1 border-b border-theme-border">
                      Settlement & Bank Details
                    </div>
                    <div>
                      <span className="text-theme-muted block">Bank Account Number</span>
                      <span className="font-semibold text-theme-main font-mono">{user?.sellerDetails?.bankAccount || 'Linked on approval'}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">IFSC Code</span>
                      <span className="font-semibold text-theme-main font-mono uppercase">{user?.sellerDetails?.ifscCode || 'Linked'}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Merchant UPI ID</span>
                      <span className="font-semibold text-theme-main">{user?.sellerDetails?.upiId || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Approval Date</span>
                      <span className="font-semibold text-theme-main">
                        {user?.sellerDetails?.approvedAt ? new Date(user.sellerDetails.approvedAt).toLocaleDateString('en-IN') : 'Verified Partner'}
                      </span>
                    </div>
                  </div>

                  {/* Warehouse Dispatch Location */}
                  <div className="md:col-span-2 p-4 rounded-2xl bg-theme-page border border-theme-border space-y-2">
                    <div className="font-bold text-theme-main uppercase tracking-wider text-[11px] pb-1 border-b border-theme-border">
                      Warehouse & Logistics Location
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-theme-muted block">Street Address</span>
                        <span className="font-semibold text-theme-main">{user?.sellerDetails?.address || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-theme-muted block">City & State</span>
                        <span className="font-semibold text-theme-main">{user?.sellerDetails?.city || ''}, {user?.sellerDetails?.state || ''}</span>
                      </div>
                      <div>
                        <span className="text-theme-muted block">PIN Code</span>
                        <span className="font-semibold text-theme-main font-mono">{user?.sellerDetails?.pincode || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-theme-muted flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <p>
                    To modify legal business documents, GSTIN numbers, or settlement bank accounts, please connect with the merchant compliance desk at <strong>sellers@realbell.in</strong> or dial <strong>1800-890-REAL</strong>.
                  </p>
                </div>
              </div>
            )}

          </main>

          {/* Merchant Dedicated Footer */}
          <MerchantFooter />

        </div>

      </div>

    </div>
  );
};
