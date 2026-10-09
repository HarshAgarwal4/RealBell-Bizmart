import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { retryRazorpayCheckout } from '../services/razorpay';
import { toast } from 'react-toastify';
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
  AlertCircle,
  RotateCcw,
  XCircle,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

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
      console.log("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!order) return;
    setIsRetrying(true);
    await retryRazorpayCheckout({
      orderId: order._id,
      onSuccess: (updatedOrder) => {
        setIsRetrying(false);
        setOrder(updatedOrder);
        toast.success("Payment authorized successfully! Your order is confirmed.");
      },
      onFailure: (err) => {
        setIsRetrying(false);
        fetchOrderDetails();
      },
      onClose: () => {
        setIsRetrying(false);
        fetchOrderDetails();
      }
    });
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirmCancel = window.confirm("Are you sure you want to cancel this order? If already paid, a refund will be initiated.");
    if (!confirmCancel) return;

    try {
      setIsCancelling(true);
      const res = await axios.post(`/orders/${order._id}/cancel`, {
        reason: "Cancelled by customer via order tracking page"
      });
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Order cancelled successfully");
        setOrder(res.data.order);
      } else {
        toast.error(res.data?.msg || "Could not cancel order");
      }
    } catch (err) {
      toast.error("Failed to cancel order: " + (err.message || "Network error"));
    } finally {
      setIsCancelling(false);
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
      <div className="min-h-screen bg-theme-page flex items-center justify-center font-poppins">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-theme-muted">Loading order tracking...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-theme-page flex items-center justify-center font-poppins px-4">
        <div className="bg-theme-card border border-theme-border p-8 rounded-3xl text-center space-y-4 max-w-md shadow-xs">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-bold text-lg text-theme-main">Order Not Found</h3>
          <p className="text-xs text-theme-muted">We couldn't retrieve the specified order tracking details.</p>
          <button 
            onClick={() => navigate('/user/orders')}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'cancelled';
  const isPaymentFailed = order.paymentStatus === 'failed';
  const isPaid = order.paymentStatus === 'paid';
  const currentStep = getStepIndex(order.orderStatus);
  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-theme-page text-theme-main font-poppins py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/user/orders')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-theme-muted hover:text-[#F59E0B] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </button>

          <span className="text-xs text-theme-muted font-mono">
            Order #{order.orderNumber}
          </span>
        </div>

        {/* 1. PAYMENT FAILURE ALERT BANNER WITH DIRECT RETRY BUTTON */}
        {isPaymentFailed && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-theme-main shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#D97706] dark:text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-theme-main">
                    Payment Incomplete / Authorization Failed
                  </h3>
                  <p className="text-xs text-theme-muted mt-0.5">
                    {order.paymentFailureDetails?.errorDescription || "Your payment was not completed or was declined by the bank."}
                  </p>
                  {order.paymentFailureDetails?.errorCode && (
                    <span className="inline-block text-[10px] font-mono text-[#D97706] dark:text-[#F59E0B] mt-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Code: {order.paymentFailureDetails.errorCode}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  disabled={isRetrying}
                  onClick={handleRetryPayment}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{isRetrying ? "Opening Gateway..." : "Retry Payment Now"}</span>
                </button>
                {canCancel && (
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={handleCancelOrder}
                    className="px-3.5 py-2.5 rounded-xl font-semibold text-xs border border-theme-border hover:bg-black/5 dark:hover:bg-white/5 text-theme-muted transition cursor-pointer"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. ORDER CANCELLED BANNER */}
        {isCancelled && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/25 text-rose-800 dark:text-rose-200 shadow-xs space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <h3 className="font-extrabold text-sm sm:text-base">Order Cancelled</h3>
            </div>
            <p className="text-xs text-rose-700 dark:text-rose-300">
              {order.cancellationReason || "This order was cancelled."}
            </p>
            {order.paymentStatus === 'refunded' && (
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 pt-1">
                💰 Refund of ₹{order.totalAmount} has been initiated back to your original payment method.
              </p>
            )}
          </motion.div>
        )}

        {/* 3. LIVE DELIVERY STATUS STEPPER CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-card rounded-3xl border border-theme-border p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-theme-border">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B] font-bold block">
                Live Shipment Tracking
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                Status: {
                  isCancelled 
                    ? 'Order Cancelled' 
                    : isPaymentFailed 
                      ? 'Awaiting Payment Authorization' 
                      : order.orderStatus === 'delivered' 
                        ? 'Package Delivered 🎉' 
                        : 'In Progress'
                }
              </h2>
            </div>
            
            <div className="text-left sm:text-right">
              <span className="text-xs text-theme-muted block">Estimated Delivery</span>
              <span className="text-xs sm:text-sm font-semibold text-theme-main flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#F59E0B]" />
                <span>{isCancelled ? 'N/A' : '3-5 Business Days'}</span>
              </span>
            </div>
          </div>

          {/* Stepper Bar (Only when not cancelled) */}
          {!isCancelled ? (
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative">
                {steps.map((st, idx) => {
                  const isPassed = isPaid ? idx <= currentStep : idx === 0;
                  const isCurrent = isPaid ? idx === currentStep : idx === 0;

                  return (
                    <div key={st.key} className="flex flex-col items-center text-center space-y-2">
                      <div 
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isPassed 
                            ? 'bg-[#F59E0B] text-slate-950 ring-4 ring-[#F59E0B]/20 shadow-xs' 
                            : 'bg-theme-page text-theme-muted border border-theme-border'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-semibold leading-tight ${
                        isCurrent ? 'text-[#D97706] dark:text-[#F59E0B]' : isPassed ? 'text-theme-main' : 'text-theme-muted'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-theme-page border border-theme-border text-center text-xs text-theme-muted">
              Shipment pipeline inactive due to order cancellation.
            </div>
          )}

          {/* RealBell Timeline Events */}
          <div className="bg-theme-page rounded-2xl p-4 sm:p-5 border border-theme-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
              Shipment & Payment Activity Log
            </h4>
            <div className="space-y-3">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.slice().reverse().map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B] mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-theme-main">{event.message}</p>
                      <span className="text-[11px] text-theme-muted">
                        {new Date(event.timestamp).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-theme-muted">No activity logged yet.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order Details & Delivery Address Cards */}
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Items Summary (7 Cols) */}
          <div className="md:col-span-7 bg-theme-card rounded-3xl border border-theme-border p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-[#F59E0B]" />
                <span>Ordered Products ({order.items.length})</span>
              </h3>
              {canCancel && !isCancelled && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>

            <div className="divide-y divide-theme-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3.5">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80"} 
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover border border-theme-border bg-theme-page shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs sm:text-sm truncate">{item.title}</h5>
                    <div className="flex items-center gap-2 text-[11px] text-theme-muted mt-0.5">
                      <span className="bg-theme-page px-1.5 py-0.2 rounded border border-theme-border uppercase text-[10px] font-bold">
                        {item.purchaseType === 'wholesale' ? 'Wholesale Batch' : 'Normal Retail'}
                      </span>
                      <span>•</span>
                      <span>Sold by: <strong className="text-theme-main">{item.sellerName || "Verified Merchant"}</strong></span>
                    </div>
                    <p className="text-xs font-bold text-[#D97706] dark:text-[#F59E0B] mt-1">
                      {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-theme-border space-y-1.5 text-xs text-theme-muted">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-theme-main">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#D97706] dark:text-[#F59E0B]">
                <span>Freight Logistics:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-theme-main pt-2 border-t border-theme-border">
                <span>Total Amount:</span>
                <span className="text-[#D97706] dark:text-[#F59E0B] font-extrabold">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Meta (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-theme-card rounded-3xl border border-theme-border p-6 space-y-3 shadow-xs">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                <span>Delivery Address</span>
              </h3>
              <div className="text-xs text-theme-muted space-y-1 leading-relaxed">
                <p className="font-bold text-theme-main">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                <p className="pt-1 text-theme-main font-medium">📞 {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Verification Card */}
            <div className="bg-theme-card rounded-3xl border border-theme-border p-6 space-y-3 shadow-xs">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#F59E0B]" />
                <span>Payment Details</span>
              </h3>
              <div className="text-xs text-theme-muted space-y-2">
                <div className="flex justify-between">
                  <span>Payment Gateway:</span>
                  <span className="font-semibold text-theme-main">Razorpay Escrow</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Status:</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isPaid
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25'
                      : isPaymentFailed
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25'
                        : order.paymentStatus === 'refunded'
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25'
                          : 'bg-theme-page text-theme-muted border border-theme-border'
                  }`}>
                    {isPaid ? 'Paid & Verified' : isPaymentFailed ? 'Authorization Failed' : order.paymentStatus === 'refunded' ? 'Refunded' : 'Pending Authorization'}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between text-[11px]">
                    <span>Payment ID:</span>
                    <span className="font-mono text-theme-main">{order.razorpayPaymentId}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-theme-border flex items-center gap-2 text-[11px] text-theme-muted">
                  <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Razorpay escrow assurance on all transactions</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
