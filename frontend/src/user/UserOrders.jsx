import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { Link, useNavigate } from 'react-router-dom';
import { retryRazorpayCheckout } from '../services/razorpay';
import { toast } from 'react-toastify';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  ArrowRight, 
  ChevronRight, 
  ShoppingBag, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderCardSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';

export const UserOrders = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingOrderId, setRetryingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      await withSkeletonDelay();
      const res = await axios.get('/user/orders');
      if (res.status === 200 && res.data.status === 1) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.log("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryOrder = async (orderId) => {
    setRetryingOrderId(orderId);
    await retryRazorpayCheckout({
      orderId,
      onSuccess: () => {
        setRetryingOrderId(null);
        toast.success("Payment authorized successfully!");
        fetchOrders();
      },
      onFailure: () => {
        setRetryingOrderId(null);
        fetchOrders();
      },
      onClose: () => {
        setRetryingOrderId(null);
        fetchOrders();
      }
    });
  };

  const getStatusBadge = (order) => {
    if (order.orderStatus === 'cancelled') {
      return (
        <span className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25 text-xs px-2.5 py-1 rounded-full font-bold">
          Cancelled
        </span>
      );
    }
    if (order.paymentStatus === 'failed') {
      return (
        <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>Payment Failed</span>
        </span>
      );
    }
    switch (order.orderStatus) {
      case 'delivered':
        return <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-xs px-2.5 py-1 rounded-full font-bold">Delivered</span>;
      case 'shipped':
      case 'out_for_delivery':
        return <span className="bg-theme-card text-theme-main border border-theme-border text-xs px-2.5 py-1 rounded-full font-semibold">In Transit</span>;
      case 'processing':
        return <span className="bg-amber-500/10 text-[#D97706] dark:text-[#F59E0B] border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-bold">Processing</span>;
      case 'confirmed':
        return <span className="bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-bold">Confirmed</span>;
      default:
        return <span className="bg-theme-page text-theme-muted border border-theme-border text-xs px-2.5 py-1 rounded-full font-semibold">{order.orderStatus}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-theme-page text-theme-main font-poppins py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 bg-theme-card border border-theme-border rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-theme-muted hover:text-theme-main transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">My Marketplace Orders</h1>
              <p className="text-xs text-theme-muted">
                Track your active shipments, delivery status, and payment invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/user/dashboard"
              className="bg-theme-card border border-theme-border hover:border-[#F59E0B] text-xs font-semibold px-4 py-2.5 rounded-xl transition text-theme-main"
            >
              My Dashboard
            </Link>
            <Link
              to="/"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Orders Content */}
        {loading ? (
          <OrderCardSkeleton count={3} />
        ) : orders.length === 0 ? (
          <div className="bg-theme-card rounded-3xl border border-theme-border p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-theme-page text-[#F59E0B] flex items-center justify-center mx-auto border border-theme-border">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-theme-main">No Orders Placed Yet</h3>
            <p className="text-xs text-theme-muted max-w-sm mx-auto">
              You haven't placed any orders on RealBell BizMart yet. Browse verified retail and wholesale products and order directly with secure Razorpay payment.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-xs"
            >
              Explore Products Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isFailed = order.paymentStatus === 'failed';
              const isPaid = order.paymentStatus === 'paid';
              const isCancelled = order.orderStatus === 'cancelled';

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-theme-card rounded-2xl border border-theme-border overflow-hidden shadow-xs hover:shadow-md transition"
                >
                  {/* Order Top Bar */}
                  <div className="bg-theme-page p-4 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-theme-main">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-theme-muted">•</span>
                      <span className="text-theme-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(order)}
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isPaid
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25'
                          : isFailed
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25'
                            : isCancelled
                              ? 'bg-theme-page text-theme-muted border border-theme-border'
                              : 'bg-theme-page text-theme-muted border border-theme-border'
                      }`}>
                        {isPaid ? 'Paid via Razorpay' : isFailed ? 'Payment Failed' : isCancelled ? 'Cancelled' : 'Payment Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Items & Details */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2 flex-1 w-full">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80"} 
                            alt={item.title} 
                            className="w-12 h-12 rounded-xl object-cover border border-theme-border bg-theme-page shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-semibold text-theme-main truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-theme-muted">
                              <span className="bg-theme-page px-1.5 py-0.2 rounded border border-theme-border text-[10px]">
                                {item.purchaseType === 'wholesale' ? 'Wholesale' : 'Retail'}
                              </span>
                              <span>•</span>
                              <span>Qty: <strong className="text-theme-main">{item.quantity}</strong></span>
                              <span>•</span>
                              <span>₹{item.price} each</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-theme-border gap-3">
                      <div>
                        <span className="text-[11px] text-theme-muted block text-left md:text-right">Total Amount</span>
                        <span className="text-base sm:text-lg font-black text-[#D97706] dark:text-[#F59E0B]">
                          ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isFailed && !isCancelled && (
                          <button
                            type="button"
                            disabled={retryingOrderId === order._id}
                            onClick={() => handleRetryOrder(order._id)}
                            className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950" />
                            <span>{retryingOrderId === order._id ? "Opening..." : "Retry Payment"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/user/track-order/${order._id}`)}
                          className="bg-theme-card hover:bg-black/5 dark:hover:bg-white/5 border border-theme-border text-theme-main text-xs font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Track Order</span>
                          <ChevronRight className="w-3.5 h-3.5 text-theme-muted" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
