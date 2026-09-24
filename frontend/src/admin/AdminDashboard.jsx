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
  RefreshCw
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
        sellers: sellersRes.data.sellers || [],
        products: prodsRes.data.products || [],
        orders: ordersRes.data.orders || [],
        users: usersRes.data.users || []
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
      const res = await axios.post('/admin/sellers/approve', { sellerId });
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Seller approved!");
        fetchDashboardData();
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Platform Super Admin
              </span>
              <span className="text-xs text-slate-400">
                RealBell BizMart Executive Operations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Admin Governance & Operations
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Monitor whole-ecosystem health, process seller applications, oversee wholesale catalog, and monitor Razorpay disbursements.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-2xl transition cursor-pointer"
            title="Refresh All"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Verified Sellers</span>
              <Store className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{approvedSellers.length}</div>
            <div className="text-[11px] text-amber-400 mt-1 font-semibold">
              {pendingSellers.length} pending review
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Catalog Listings</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.products.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Across all wholesale categories</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Platform Orders</span>
              <ShoppingBag className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.orders.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Direct B2B orders</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Gross Platform Volume</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              ₹{totalGMV.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Escrow verified transactions</div>
          </div>
        </div>

        {/* Action Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Widget 1: Pending Seller Approvals (Actionable right here!) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Pending Seller Approvals</h3>
                {pendingSellers.length > 0 && (
                  <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                    {pendingSellers.length}
                  </span>
                )}
              </div>
              <Link
                to="/admin/sellers"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-500">Checking pending applicants...</p>
            ) : pendingSellers.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl p-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-300">No pending seller applications</p>
                <p className="text-[11px] text-slate-500">All seller registration requests are up to date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSellers.slice(0, 4).map(seller => (
                  <div
                    key={seller._id}
                    className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {seller.sellerDetails?.shopName || 'Registered Shop'}
                      </p>
                      <p className="text-slate-400 text-[11px] truncate">
                        {seller.name} • GST: <span className="font-mono text-slate-300">{seller.sellerDetails?.gstNumber || 'N/A'}</span>
                      </p>
                      <p className="text-amber-400/90 text-[10px] capitalize">
                        {seller.sellerDetails?.businessCategory || 'Wholesale'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleQuickApprove(seller._id)}
                        disabled={processingId === seller._id}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <Link
                        to="/admin/sellers"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="Review full details"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Widget 2: Recent Platform Orders */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Recent Platform Orders</h3>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-500">Loading orders...</p>
            ) : stats.orders.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl p-4">
                <Clock className="w-8 h-8 text-slate-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-300">No orders placed yet</p>
                <p className="text-[11px] text-slate-500">Live buyer transactions will stream here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.orders.slice(0, 4).map(order => (
                  <div
                    key={order._id}
                    className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">#{order.orderNumber}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] truncate mt-0.5">
                        Buyer: {order.shippingAddress?.fullName || order.buyer?.name} • {order.items?.length || 0} item(s)
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-amber-400 text-sm block">
                        ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">
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
