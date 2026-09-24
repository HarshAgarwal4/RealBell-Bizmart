import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  MapPin, 
  CreditCard, 
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/orders/${id}`);
      if (res.status === 200 && res.data.status === 1) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed & Paid' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Dispatched' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStepIndex = (status) => {
    const map = {
      placed: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      out_for_delivery: 4,
      delivered: 5
    };
    return map[status] !== undefined ? map[status] : 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-poppins">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading order tracking...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-poppins px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Order Not Found</h3>
          <p className="text-xs text-slate-500">We couldn't retrieve the specified order tracking details.</p>
          <button 
            onClick={() => navigate('/user/orders')}
            className="bg-amber-500 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-poppins py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/user/orders')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </button>

          <span className="text-xs text-slate-400">
            Order #{order.orderNumber}
          </span>
        </div>

        {/* Live Delivery Status Stepper Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold block">
                Live Shipment Tracking
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                Status: {order.orderStatus === 'delivered' ? 'Package Delivered 🎉' : 'In Progress'}
              </h2>
            </div>
            
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Estimated Delivery</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Truck className="w-4 h-4" />
                <span>3-5 Business Days</span>
              </span>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={st.key} className="flex flex-col items-center text-center space-y-2">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isPassed 
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-md' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold leading-tight ${isCurrent ? 'text-amber-600 dark:text-amber-400' : isPassed ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RealBell Timeline Events */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Shipment Activity Log
            </h4>
            <div className="space-y-3">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.slice().reverse().map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{event.message}</p>
                      <span className="text-[11px] text-slate-400">
                        {new Date(event.timestamp).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No activity logged yet.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order Details & Delivery Address Cards */}
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Items Summary (8 Cols) */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>Ordered Products ({order.items.length})</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3.5">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80"} 
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs sm:text-sm truncate">{item.title}</h5>
                    <p className="text-[11px] text-slate-400">
                      Sold by: <span className="text-slate-600 dark:text-slate-300 font-medium">{item.sellerName || "Verified Seller"}</span>
                    </p>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                      {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Freight Logistics:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Paid:</span>
                <span className="text-amber-600 dark:text-amber-400">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Meta (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Delivery Address</span>
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                <p className="pt-1 text-slate-500 font-medium">📞 {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Verification Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>Payment Details</span>
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Razorpay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {order.paymentStatus === 'paid' ? 'Verified & Authorized' : 'Pending'}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Payment ID:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
