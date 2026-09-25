import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  RefreshCw, 
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Package,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderCardSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      await withSkeletonDelay();
      const res = await axios.get('/admin/orders');
      if (res.status === 200 && res.data.status === 1) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load platform orders");
    } finally {
      setLoading(false);
    }
  };

  const totalGMV = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const activeShipments = orders.filter(o => 
    ['confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(o.orderStatus)
  ).length;

  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const q = search.toLowerCase();
    const orderNum = o.orderNumber?.toLowerCase() || '';
    const buyer = o.buyer?.name?.toLowerCase() || '';
    const shippingName = o.shippingAddress?.fullName?.toLowerCase() || '';
    const payId = o.razorpayPaymentId?.toLowerCase() || '';
    const city = o.shippingAddress?.city?.toLowerCase() || '';
    const matchesSearch = orderNum.includes(q) || buyer.includes(q) || shippingName.includes(q) || payId.includes(q) || city.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* ===================== HEADER & FINANCIAL SUMMARY ===================== */}
        <div className="bg-theme-card p-5 sm:p-7 rounded-3xl border border-theme-border shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-theme-main tracking-tight">
                Platform Orders & GMV
              </h1>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                Escrow Monitored
              </span>
            </div>
            <p className="text-xs text-theme-muted leading-relaxed">
              Audit transaction lifecycles, monitor Razorpay payment IDs, verify delivery fulfillment, and track escrow settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full lg:w-auto justify-between lg:justify-end">
            <div className="bg-theme-page px-3 sm:px-4 py-2 rounded-2xl border border-theme-border flex items-center gap-3 sm:gap-4 text-xs flex-1 sm:flex-initial justify-around sm:justify-start">
              <div>
                <span className="text-[10px] text-theme-muted uppercase font-bold block">Gross Volume (GMV)</span>
                <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{totalGMV.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-theme-border h-6 w-px bg-theme-border block"></span>
              <div>
                <span className="text-[10px] text-theme-muted uppercase font-bold block">Fulfillment SLA</span>
                <span className="text-xs sm:text-sm font-bold text-[#F59E0B] font-mono">
                  {orders.length > 0 ? `${Math.round((deliveredOrders / orders.length) * 100)}%` : '100%'}
                </span>
              </div>
            </div>

            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2.5 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border text-amber-600 dark:text-amber-400 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ===================== METRIC CHIPS ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <div className="bg-theme-card border border-theme-border p-3 sm:p-4 rounded-2xl flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-theme-muted text-[10px] uppercase font-bold block truncate">TOTAL ORDERS</span>
              <span className="text-base sm:text-xl font-black text-theme-main font-mono">{orders.length}</span>
            </div>
            <ShoppingBag className="w-5 h-5 text-blue-500 opacity-70 shrink-0 ml-2" />
          </div>

          <div className="bg-theme-card border border-theme-border p-3 sm:p-4 rounded-2xl flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-theme-muted text-[10px] uppercase font-bold block truncate">ESCROW CLEARED</span>
              <span className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {orders.filter(o => o.paymentStatus === 'paid').length}
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-500 opacity-70 shrink-0 ml-2" />
          </div>

          <div className="bg-theme-card border border-theme-border p-3 sm:p-4 rounded-2xl flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-theme-muted text-[10px] uppercase font-bold block truncate">IN TRANSIT</span>
              <span className="text-base sm:text-xl font-black text-[#F59E0B] font-mono">{activeShipments}</span>
            </div>
            <Truck className="w-5 h-5 text-[#F59E0B] opacity-70 shrink-0 ml-2" />
          </div>

          <div className="bg-theme-card border border-theme-border p-3 sm:p-4 rounded-2xl flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-theme-muted text-[10px] uppercase font-bold block truncate">DELIVERED</span>
              <span className="text-base sm:text-xl font-black text-purple-600 dark:text-purple-400 font-mono">{deliveredOrders}</span>
            </div>
            <CheckCircle className="w-5 h-5 text-purple-500 opacity-70 shrink-0 ml-2" />
          </div>
        </div>

        {/* ===================== FILTER TABS & SEARCH ===================== */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs no-scrollbar -mx-1 px-1">
            {['all', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map(status => {
              const count = status === 'all' 
                ? orders.length 
                : orders.filter(o => o.orderStatus === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl capitalize font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 text-xs ${
                    filterStatus === status
                      ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-2xs'
                      : 'bg-theme-card text-theme-muted border border-theme-border hover:text-theme-main hover:bg-[#F59E0B]/10'
                  }`}
                >
                  <span>{status.replace(/_/g, ' ')}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    filterStatus === status ? 'bg-slate-950 text-white' : 'bg-theme-card-subtle text-theme-muted'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 lg:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-theme-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search order#, buyer, PayID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted/60 focus:outline-hidden focus:border-[#F59E0B] transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-theme-muted hover:text-theme-main text-xs cursor-pointer font-bold"
              >
                ×
              </button>
            )}
          </div>

        </div>

        {/* ===================== ORDERS LIST ===================== */}
        {loading ? (
          <OrderCardSkeleton count={3} />
        ) : filteredOrders.length === 0 ? (
          <div className="bg-theme-card rounded-3xl border border-theme-border p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-theme-muted/50 mx-auto" />
            <h3 className="font-bold text-base text-theme-main">No Orders Found</h3>
            <p className="text-xs text-theme-muted max-w-sm mx-auto">
              No orders matched your selected status filter or search parameters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order._id}
                className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl p-4 sm:p-5 md:p-6 shadow-xs space-y-4 text-xs transition"
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-theme-border">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-mono font-bold text-xs sm:text-sm text-theme-main">#{order.orderNumber}</span>
                    <span className="text-theme-muted/50 hidden xs:inline">•</span>
                    <span className="text-theme-muted flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <Calendar className="w-3.5 h-3.5 text-theme-muted" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </span>
                    {order.razorpayPaymentId && (
                      <span className="bg-theme-page border border-theme-border px-2 sm:px-2.5 py-0.5 rounded-lg font-mono text-[10px] sm:text-[11px] text-[#F59E0B] flex items-center gap-1 max-w-full truncate">
                        <CreditCard className="w-3 h-3 text-[#F59E0B] shrink-0" />
                        <span className="truncate">PayID: {order.razorpayPaymentId}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-theme-border/50">
                    <span className={`px-2.5 sm:px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Escrow Cleared' : order.paymentStatus}
                    </span>

                    <span className={`px-2.5 sm:px-3 py-1 rounded-full capitalize font-bold text-[10px] ${
                      order.orderStatus === 'delivered'
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                        : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    }`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* 2 Columns: Items breakdown + Shipping destination */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  
                  {/* Items List */}
                  <div className="lg:col-span-7 xl:col-span-8 space-y-2">
                    <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] block">
                      Ordered Products ({order.items.length})
                    </span>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-theme-page p-3 rounded-2xl border border-theme-border">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80"}
                              alt={item.title}
                              className="w-10 h-10 object-cover rounded-xl border border-theme-border bg-theme-card shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-theme-main text-xs sm:text-sm truncate" title={item.title}>
                                {item.title}
                              </p>
                              {item.sellerName && (
                                <p className="text-[10px] text-theme-muted truncate">
                                  Wholesaler: {item.sellerName}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0 font-mono text-xs self-end sm:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-theme-border/40 w-full sm:w-auto flex sm:block justify-between items-center">
                            <span className="text-theme-muted text-[11px] sm:mr-1">
                              {item.quantity} × ₹{Number(item.price || 0).toLocaleString('en-IN')} =
                            </span>
                            <strong className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                              ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buyer & Delivery Info */}
                  <div className="lg:col-span-5 xl:col-span-4 bg-theme-page p-4 rounded-2xl border border-theme-border space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] block">
                        Buyer & Shipping Destination
                      </span>
                      <p className="font-bold text-theme-main text-sm">
                        {order.shippingAddress?.fullName || order.buyer?.name || 'Customer'}
                      </p>
                      {order.shippingAddress?.phone && (
                        <p className="text-theme-muted flex items-center gap-1.5 text-xs">
                          <Phone className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                          <a href={`tel:${order.shippingAddress.phone}`} className="hover:underline font-mono">
                            {order.shippingAddress.phone}
                          </a>
                        </p>
                      )}
                      <p className="text-theme-muted leading-relaxed text-[11px] pt-0.5">
                        {order.shippingAddress?.addressLine ? (
                          `${order.shippingAddress.addressLine}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`
                        ) : (
                          'Delivery address recorded via user profile'
                        )}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-theme-border flex justify-between items-center">
                      <span className="text-theme-muted text-xs font-semibold">Total Order Value:</span>
                      <span className="text-base sm:text-lg font-black text-[#F59E0B] font-mono">
                        ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
