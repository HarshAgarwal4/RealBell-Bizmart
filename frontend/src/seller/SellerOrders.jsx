import React, { useState, useEffect } from 'react';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  ChevronDown,
  RefreshCw,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderCardSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';

export const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      await withSkeletonDelay();
      const res = await axios.get('/seller/orders');
      if (res.status === 200 && res.data.status === 1) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load seller orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await axios.post('/seller/orders/status', {
        orderId,
        orderStatus: newStatus
      });
      if (res.status === 200 && res.data.status === 1) {
        toast.success(`Order status updated to "${newStatus.replace(/_/g, ' ')}"`);
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.orderStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wholesale Inflow Orders</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fulfill wholesale commercial orders, update tracking, and dispatch consignments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {['all', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap capitalize font-medium transition ${
              filterStatus === status
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
            }`}
          >
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <OrderCardSkeleton count={3} />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base">No Orders in this Status</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When buyers place wholesale orders for your listed inventory, they will appear right here with Razorpay verification.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs space-y-4 p-5 sm:p-6"
            >
              {/* Order Info Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {order.paymentStatus === 'paid' ? 'Paid via Razorpay' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              {/* Items & Shipping Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                {/* Products in this order */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Ordered Items
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80"}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</h5>
                          <p className="text-slate-500 text-[11px]">
                            Qty: <strong className="text-slate-700 dark:text-slate-300">{item.quantity}</strong> × ₹{item.price} = ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-right">
                    <span className="text-slate-500 text-[11px] mr-2">Total Order Value:</span>
                    <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Shipping & Buyer Address */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Consignment Delivery Address</span>
                  </h4>
                  
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{order.shippingAddress?.fullName || 'Buyer'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{order.shippingAddress?.phone}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                      {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                  </div>

                  {/* Status Updater */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Update Fulfillment Status
                    </label>
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="placed">Order Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing & Packing</option>
                      <option value="shipped">Shipped / In Transit</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered to Buyer</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
