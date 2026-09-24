import React, { useState } from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  X, 
  Sparkles, 
  Headphones,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const SourcingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requirement, setRequirement] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    setSubmitted(true);
    toast.success('Callback scheduled! Customer support will call within 15 minutes.');
    setTimeout(() => {
      setSubmitted(false);
      setShowCallbackForm(false);
      setPhoneNumber('');
      setRequirement('');
      setIsOpen(false);
    }, 3000);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent("Hello RealBell BizMart Support, I need assistance with my order on the marketplace.");
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-sm font-poppins">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="assistant-pill"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_auto] hover:bg-right text-slate-950 font-semibold px-4 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-white dark:border-slate-800 cursor-pointer transition-all duration-300"
          >
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80"
                alt="Support Specialist"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs font-bold text-slate-950 leading-tight">
                Marketplace Helpdesk
              </div>
              <div className="text-[9px] sm:text-[10px] font-medium text-slate-900/80">
                Online • Need Help Ordering?
              </div>
            </div>
            <span className="bg-slate-950/20 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
              Support
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="assistant-card"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden w-80 sm:w-96 text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80"
                    alt="Pooja Sharma"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <span>Pooja Sharma</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h4>
                  <p className="text-[10px] text-slate-400">Order Help & Customer Support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>RealBell Helpdesk</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Hi! Need help with payment, order tracking, product recommendations, or becoming a seller on RealBell BizMart?
                </p>
              </div>

              {showCallbackForm ? (
                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      What do you need help with?
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Order inquiry, payment status, product query..."
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCallbackForm(false)}
                      className="w-1/3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitted}
                      className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-xs"
                    >
                      {submitted ? 'Requesting...' : 'Request Callback'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCallbackForm(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-950" />
                    Request Free Callback
                  </motion.button>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWhatsAppChat}
                      className="bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      WhatsApp
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const el = document.getElementById('product-catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        setIsOpen(false);
                      }}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                      <span>Browse Store</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SourcingAssistant;
