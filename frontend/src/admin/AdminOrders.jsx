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
        <div className="bg-theme-card p-6 sm:p-7 rounded-3xl border border-theme-border shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-theme-main">Platform Orders & Gross Merchandise Volume</h1>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Escrow Monitored
              </span>
            </div>
            <p className="text-xs text-theme-muted">
              Audit transaction lifecycles, monitor Razorpay payment IDs, verify delivery fulfillment, and track escrow settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-theme-page px-4 py-2 rounded-2xl border border-theme-border flex items-center gap-3 text-xs">
              <div>
                <span className="text-[10px] text-theme-muted uppercase font-bold block">Gross Volume (GMV)</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{totalGMV.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-theme-border">|</span>
              <div>
                <span className="text-[10px] text-theme-muted uppercase font-bold block">Fulfillment SLA</span>
                <span className="text-sm font-bold text-[#F59E0B] font-mono">
                  {orders.length > 0 ? `${Math.round((deliveredOrders / orders.length) * 100)}%` : '100%'}
                </span>
              </div>
            </div>

            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2.5 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border text-amber-600 dark:text-amber-400 rounded-xl transition cursor-pointer disabled:opacity-50"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ===================== METRIC CHIPS ===================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-theme-card border border-theme-border p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-theme-muted text-[10px] font-bold block">TOTAL ORDERS</span>
              <span className="text-lg font-black text-theme-main">{orders.length}</span>
            </div>
            <ShoppingBag className="w-5 h-5 text-blue-500 opacity-60" />
          </div>

          <div className="bg-theme-card border border-theme-border p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-theme-muted text-[10px] font-bold block">ESCROW CLEARED</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {orders.filter(o => o.paymentStatus === 'paid').length}
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-500 opacity-60" />
          </div>

          <div className="bg-theme-card border border-theme-border p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-theme-muted text-[10px] font-bold block">IN TRANSIT</span>
              <span className="text-lg font-black text-[#F59E0B]">{activeShipments}</span>
            </div>
            <Truck className="w-5 h-5 text-[#F59E0B] opacity-60" />
          </div>

          <div className="bg-theme-card border border-theme-border p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-theme-muted text-[10px] font-bold block">DELIVERED</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">{deliveredOrders}</span>
            </div>
            <CheckCircle className="w-5 h-5 text-purple-500 opacity-60" />
          </div>
        </div>

        {/* ===================== FILTER TABS & SEARCH ===================== */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {['all', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map(status => {
              const count = status === 'all' 
                ? orders.length 
                : orders.filter(o => o.orderStatus === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl capitalize font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
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
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-theme-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order#, buyer, payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted/60 focus:outline-hidden focus:border-[#F59E0B] transition"
            />
          </div>

        </div>

        {/* ===================== ORDERS LIST ===================== */}
        {loading ? (
          <div className="text-center py-20 bg-theme-card rounded-3xl border border-theme-border">
            <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-theme-muted">Loading order records...</p>
          </div>
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
                className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 text-xs transition"
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-theme-border">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-sm text-theme-main">#{order.orderNumber}</span>
                    <span className="text-theme-muted/50">•</span>
                    <span className="text-theme-muted flex items-center gap-1.5">
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
                      <span className="bg-theme-page border border-theme-border px-2.5 py-0.5 rounded-lg font-mono text-[11px] text-[#F59E0B] flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-[#F59E0B]" />
                        <span>PayID: {order.razorpayPaymentId}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Escrow Cleared' : order.paymentStatus}
                    </span>

                    <span className={`px-3 py-1 rounded-full capitalize font-bold text-[10px] ${
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Items List */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] block">
                      Ordered Products ({order.items.length})
                    </span>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-theme-page p-3 rounded-2xl border border-theme-border">
                          <span className="font-semibold text-theme-main truncate max-w-xs">{item.title}</span>
                          <span className="text-theme-muted font-mono text-xs">
                            {item.quantity} × ₹{item.price} = <strong className="text-emerald-600 dark:text-emerald-400">₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buyer & Delivery Info */}
                  <div className="bg-theme-page p-4 rounded-2xl border border-theme-border space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] block">
                        Buyer & Shipping Coordinates
                      </span>
                      <p className="font-bold text-theme-main text-sm">
                        {order.shippingAddress?.fullName || order.buyer?.name}
                      </p>
                      <p className="text-theme-muted flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{order.shippingAddress?.phone || 'N/A'}</span>
                      </p>
                      <p className="text-theme-muted leading-relaxed text-[11px] pt-1">
                        {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-theme-border flex justify-between items-center">
                      <span className="text-theme-muted text-xs">Total Order Value:</span>
                      <span className="text-base font-black text-[#F59E0B] font-mono">
                        ₹{Number(order.totalAmount).toLocaleString('en-IN')}
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
