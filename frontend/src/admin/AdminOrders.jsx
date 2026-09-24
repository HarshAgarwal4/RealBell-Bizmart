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
  ShieldCheck
} from 'lucide-react';

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

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch = o.orderNumber?.toLowerCase().includes(q) ||
                          o.buyer?.name?.toLowerCase().includes(q) ||
                          o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
                          o.razorpayPaymentId?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header with GMV counter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Platform Orders & Gross Merchandise Volume</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring of transactions, Razorpay escrow settlement, and fulfillment
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Platform GMV</span>
              <span className="text-lg font-bold text-emerald-400">
                ₹{totalGMV.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={fetchOrders}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by order#, buyer, payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {['all', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading platform orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-slate-950/60 rounded-3xl border border-slate-800 p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-300">No Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No orders matched your selected status or query.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order._id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4 text-xs"
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-850">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-sm text-white">#{order.orderNumber}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {order.razorpayPaymentId && (
                      <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono text-[11px] text-slate-400">
                        PayID: {order.razorpayPaymentId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {order.paymentStatus}
                    </span>

                    <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full capitalize font-semibold">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Details Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Items */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Ordered Items ({order.items.length})
                    </span>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                          <span className="font-semibold text-white truncate max-w-xs">{item.title}</span>
                          <span className="text-slate-400">
                            Qty: <strong className="text-slate-200">{item.quantity}</strong> × ₹{item.price} = ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buyer & Shipping */}
                  <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850 space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Buyer Delivery Info
                    </span>
                    <p className="font-semibold text-white">{order.shippingAddress?.fullName || order.buyer?.name}</p>
                    <p className="text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{order.shippingAddress?.phone}</span>
                    </p>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Total Value:</span>
                      <span className="text-base font-bold text-amber-400">
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
