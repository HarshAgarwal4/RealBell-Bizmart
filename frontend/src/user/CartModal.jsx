import React, { useState, useEffect } from 'react';
import { useStore } from '../zustand/store';
import { useNavigate } from 'react-router-dom';
import { initiateRazorpayCheckout } from '../services/razorpay';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Truck,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export const CartModal = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const cart = useStore(state => state.cart);
  const isCartOpen = useStore(state => state.isCartOpen);
  const setIsCartOpen = useStore(state => state.setIsCartOpen);
  const removeFromCart = useStore(state => state.removeFromCart);
  const updateCartQty = useStore(state => state.updateCartQty);
  const clearCart = useStore(state => state.clearCart);

  const [step, setStep] = useState('cart'); // 'cart' | 'shipping'
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: user?.address?.addressLine || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        addressLine: prev.addressLine || user.address?.addressLine || '',
        city: prev.city || user.address?.city || '',
        state: prev.state || user.address?.state || '',
        pincode: prev.pincode || user.address?.pincode || ''
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
  const shippingFee = 0; // Free enterprise delivery
  const totalAmount = subtotal + shippingFee;

  const handleProceedToShipping = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate('/login');
      toast.info("Please sign in to proceed with checkout");
      return;
    }
    if (cart.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    setStep('shipping');
  };

  const handleCheckoutWithRazorpay = async (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      items: cart,
      shippingAddress,
      totalAmount
    };

    await initiateRazorpayCheckout({
      orderData,
      onSuccess: (order) => {
        setIsProcessing(false);
        clearCart();
        setIsCartOpen(false);
        setStep('cart');
        navigate(`/user/track-order/${order._id}`);
      },
      onFailure: (err) => {
        setIsProcessing(false);
      },
      onClose: () => {
        setIsProcessing(false);
      }
    });
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { setIsCartOpen(false); setStep('cart'); }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="w-screen max-w-md bg-theme-card border-l border-theme-border flex flex-col shadow-2xl text-theme-main"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-theme-border flex items-center justify-between bg-theme-page">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-bold text-sm sm:text-base">
                  {step === 'cart' ? `Shopping Cart (${cart.length} items)` : 'Delivery & Payment'}
                </h3>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setStep('cart'); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base">Your shopping cart is empty</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Explore top trending products on RealBell BizMart marketplace and order with secure Razorpay payment.
                  </p>
                  <button
                    onClick={() => { setIsCartOpen(false); navigate('/'); }}
                    className="mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
                  >
                    Explore Products
                  </button>
                </div>
              ) : step === 'cart' ? (
                /* Step 1: Cart Items List */
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item._id}
                      className="flex gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:border-amber-400/40 transition"
                    >
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80"} 
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-white dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h5 className="font-semibold text-xs sm:text-sm truncate" title={item.title}>
                              {item.title}
                            </h5>
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="text-slate-400 hover:text-rose-500 transition p-0.5"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                            ₹{item.price} / {item.unit || 'pc'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Qty Controls */}
                          <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                            <button 
                              onClick={() => updateCartQty(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold font-mono">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateCartQty(item._id, item.quantity + 1)}
                              className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Step 2: Shipping Form */
                <form id="shipping-form" onSubmit={handleCheckoutWithRazorpay} className="space-y-3.5">
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <Truck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Free Express Doorstep Delivery included on this order!</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Contact / Business Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Trading Co. / Ramesh Gupta"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Contact Phone Number *
                    </label>
                    <input 
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Warehouse / Delivery Address *
                    </label>
                    <textarea 
                      required
                      rows="2"
                      value={shippingAddress.addressLine}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                      placeholder="Shop/Floor/Building number, Industrial Area/Street"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        City *
                      </label>
                      <input 
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        placeholder="Noida"
                        className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        State *
                      </label>
                      <input 
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        placeholder="UP"
                        className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        PIN *
                      </label>
                      <input 
                        type="text"
                        required
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                        placeholder="201301"
                        className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer with Price breakdown & Actions */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Cart Subtotal:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Freight & Logistics:</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Payable:</span>
                    <span className="text-amber-600 dark:text-amber-400">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToShipping}
                    className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 font-semibold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 transition cursor-pointer"
                  >
                    <span>Proceed to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <div className="space-y-2">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      form="shipping-form"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isProcessing ? "Opening Razorpay..." : `Pay ₹${totalAmount.toLocaleString('en-IN')} with Razorpay`}</span>
                    </motion.button>
                    <button 
                      type="button"
                      onClick={() => setStep('cart')}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1"
                    >
                      ← Back to Cart Items
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>Secured by 256-bit Razorpay Payment Gateway & RealBell Escrow</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
