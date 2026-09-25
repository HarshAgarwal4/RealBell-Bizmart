import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Link } from 'react-router-dom';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck,
  RefreshCw,
  Activity,
  Layers,
  Sparkles,
  CreditCard,
  Building2,
  DollarSign,
  ArrowUpRight,
  ExternalLink,
  Lock,
  Database,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    sellers: [],
    products: [],
    orders: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sellersRes, prodsRes, ordersRes, usersRes] = await Promise.all([
        axios.get('/admin/sellers'),
        axios.get('/admin/products'),
        axios.get('/admin/orders'),
        axios.get('/admin/users')
      ]);

      setStats({
        sellers: sellersRes.data?.sellers || [],
        products: prodsRes.data?.products || [],
        orders: ordersRes.data?.orders || [],
        users: usersRes.data?.users || []
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprove = async (sellerId) => {
    try {
      setProcessingId(sellerId);
      const res = await axios.post('/admin/sellers/approve', { 
        userId: sellerId,
        sellerId 
      });
      if (res.status === 200 && res.data.status === 1) {
        toast.success(res.data.msg || "Seller approved! Dashboard unlocked.");
        fetchDashboardData();
      } else {
        toast.error(res.data?.msg || "Failed to approve seller");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingSellers = stats.sellers.filter(s => s.sellerStatus === 'pending');
  const approvedSellers = stats.sellers.filter(s => s.sellerStatus === 'approved');
  const totalGMV = stats.orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const pendingShipments = stats.orders.filter(o => 
    ['confirmed', 'processing', 'shipped'].includes(o.orderStatus)
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* ===================== EXECUTIVE WELCOME BANNER ===================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-theme-card via-theme-card to-amber-500/10 p-6 sm:p-8 rounded-3xl border border-theme-border shadow-xs">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#F59E0B] text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  Executive Command
                </span>
                <span className="text-xs text-theme-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  RealBell BizMart B2B Wholesale Platform
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-main tracking-tight">
                Governance & Operations Portal
              </h1>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                Oversee multi-tenant commerce, inspect GST compliance, govern supplier onboarding, and monitor live escrow volume across India.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border text-amber-600 dark:text-amber-400 font-bold text-xs rounded-2xl transition cursor-pointer shadow-2xs disabled:opacity-50"
                title="Refresh Real-Time Metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Platform</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================== 4 CORE KPI METRIC CARDS ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Gross Merchandise Volume */}
          <div className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl p-5 shadow-xs transition-all group">
            <div className="flex items-center justify-between text-theme-muted mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Platform GMV</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              ₹{totalGMV.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border">
              <span>Razorpay Escrow Paid</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Cleared</span>
            </div>
          </div>

          {/* Card 2: Verified Sellers */}
          <div className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl p-5 shadow-xs transition-all group">
            <div className="flex items-center justify-between text-theme-muted mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Wholesale Merchants</span>
              <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-amber-600 dark:text-amber-400 border border-[#F59E0B]/20 group-hover:scale-105 transition-transform">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-theme-main tracking-tight">
              {approvedSellers.length}
            </div>
            <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-theme-border">
              <span className="text-theme-muted">Pending Review</span>
              <span className={`font-bold ${pendingSellers.length > 0 ? 'text-amber-600 dark:text-amber-400 animate-pulse' : 'text-theme-muted'}`}>
                {pendingSellers.length} applicants
              </span>
            </div>
          </div>

          {/* Card 3: Platform Orders */}
          <div className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl p-5 shadow-xs transition-all group">
            <div className="flex items-center justify-between text-theme-muted mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total B2B Orders</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-theme-main tracking-tight">
              {stats.orders.length}
            </div>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border">
              <span>Active Inflow</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">{pendingShipments} in transit</span>
            </div>
          </div>

          {/* Card 4: Wholesale Catalog SKUs */}
          <div className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl p-5 shadow-xs transition-all group">
            <div className="flex items-center justify-between text-theme-muted mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Wholesale Catalog</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-theme-main tracking-tight">
              {stats.products.length}
            </div>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border">
              <span>Registered Accounts</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{stats.users.length} users</span>
            </div>
          </div>

        </div>

        {/* ===================== SYSTEM INFRASTRUCTURE HEALTH STRIP ===================== */}
        <div className="bg-theme-card border border-theme-border rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#F59E0B] animate-pulse" />
            <span className="font-bold text-theme-main">Infrastructure Status:</span>
            <span className="text-theme-muted">All Microservices Healthy</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-theme-muted text-[11px]">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Razorpay Escrow: <strong className="text-theme-main">Connected</strong></span>
            </span>
            <span className="hidden sm:inline text-theme-border">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>GSTIN Compliance Engine: <strong className="text-theme-main">Active</strong></span>
            </span>
            <span className="hidden sm:inline text-theme-border">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>RBAC Token Guard: <strong className="text-theme-main">Enforced</strong></span>
            </span>
          </div>
        </div>

        {/* ===================== ACTION WIDGETS GRID ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Widget 1: Pending Seller Approvals */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-theme-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-amber-600 dark:text-amber-400">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-theme-main">Pending Merchant Applications</h3>
                  <p className="text-[11px] text-theme-muted">Requires business & GST verification</p>
                </div>
              </div>
              <Link
                to="/admin/sellers"
                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 font-semibold flex items-center gap-1 bg-[#F59E0B]/10 px-3 py-1.5 rounded-xl border border-[#F59E0B]/20 transition"
              >
                <span>Full Review ({pendingSellers.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-theme-muted">Checking pending applicants...</div>
            ) : pendingSellers.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-theme-border rounded-2xl p-4 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-theme-main">All Merchant Applications Processed</p>
                <p className="text-[11px] text-theme-muted max-w-xs mx-auto">
                  No pending vendor registration requests in queue. New applications will notify here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSellers.slice(0, 4).map(seller => (
                  <div
                    key={seller._id}
                    className="p-4 bg-theme-page border border-theme-border hover:border-[#F59E0B]/40 rounded-2xl flex items-center justify-between gap-3 text-xs transition"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-theme-main truncate text-sm">
                          {seller.sellerDetails?.shopName || 'Registered Wholesale Store'}
                        </p>
                        <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">
                          {seller.sellerDetails?.businessCategory || 'B2B'}
                        </span>
                      </div>
                      <p className="text-theme-muted text-[11px] truncate">
                        Owner: {seller.name} • GST: <span className="font-mono text-theme-main font-medium">{seller.sellerDetails?.gstNumber || 'Pending Verification'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleQuickApprove(seller._id)}
                        disabled={processingId === seller._id}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <Link
                        to="/admin/sellers"
                        className="p-1.5 text-theme-muted hover:text-theme-main rounded-xl hover:bg-[#F59E0B]/10 transition"
                        title="Inspect full application credentials"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Widget 2: Recent Platform Orders */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-theme-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-theme-main">Live Platform Orders</h3>
                  <p className="text-[11px] text-theme-muted">Real-time buyer checkout stream</p>
                </div>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 font-semibold flex items-center gap-1 bg-[#F59E0B]/10 px-3 py-1.5 rounded-xl border border-[#F59E0B]/20 transition"
              >
                <span>All Orders ({stats.orders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-theme-muted">Loading order stream...</div>
            ) : stats.orders.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-theme-border rounded-2xl p-4 space-y-2">
                <Clock className="w-8 h-8 text-theme-muted mx-auto" />
                <p className="text-xs font-semibold text-theme-main">No Orders Logged Yet</p>
                <p className="text-[11px] text-theme-muted max-w-xs mx-auto">
                  Buyer purchases across all product categories will immediately populate here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.orders.slice(0, 4).map(order => (
                  <div
                    key={order._id}
                    className="p-4 bg-theme-page border border-theme-border hover:border-[#F59E0B]/40 rounded-2xl flex items-center justify-between gap-3 text-xs transition"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-theme-main">#{order.orderNumber}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-bold ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'Escrow Paid' : order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-theme-muted text-[11px] truncate">
                        Buyer: <strong className="text-theme-main">{order.shippingAddress?.fullName || order.buyer?.name}</strong> • {order.items?.length || 1} SKU(s)
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#F59E0B] text-sm block">
                        ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-theme-muted capitalize">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
