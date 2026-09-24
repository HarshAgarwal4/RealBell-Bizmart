import React, { useState } from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  X, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Headphones,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const SourcingAssistant = ({ onOpenRFQ }) => {
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
    toast.success('Callback scheduled! Sourcing expert will call within 15 minutes.');
    setTimeout(() => {
      setSubmitted(false);
      setShowCallbackForm(false);
      setPhoneNumber('');
      setRequirement('');
      setIsOpen(false);
    }, 3000);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent("Hello RealBell BizMart Team, I have a wholesale bulk order requirement and would like to get quotes.");
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-sm">
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
                alt="Sourcing Specialist"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs font-bold text-slate-950 leading-tight">
                Sourcing Specialist
              </div>
              <div className="text-[9px] sm:text-[10px] font-medium text-slate-900/80">
                Online • Free Quotes
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="assistant-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden w-80 sm:w-88 transition-colors"
          >
            {/* Header Bar */}
            <div className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold tracking-wide text-amber-400">
                  RealBell Sourcing Desk
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Photo & Assistant Details */}
            <div className="p-4 bg-gradient-to-b from-amber-50/70 dark:from-slate-800/80 to-white dark:to-slate-900 text-center border-b border-slate-100 dark:border-slate-800">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                  alt="Priya Sharma - Senior Sourcing Specialist"
                  className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-amber-400"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
                  ACTIVE
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Priya Sharma
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                Senior Procurement Specialist
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                Have a Wholesale Requirement? We negotiate bulk pricing and verify suppliers for you.
              </p>
            </div>

            {/* Action Area */}
            <div className="p-4 bg-white dark:bg-slate-900 space-y-2.5">
              {showCallbackForm ? (
                submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4 space-y-2"
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Callback Scheduled!</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">We will connect with you within 15 mins.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-2">
                    <input
                      type="tel"
                      required
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Product needed (e.g. 500 Polo T-shirts)"
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowCallbackForm(false)}
                        className="w-1/3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 py-2 rounded-xl transition cursor-pointer"
                      >
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs py-2 rounded-xl transition shadow-xs cursor-pointer"
                      >
                        Call Me Back
                      </motion.button>
                    </div>
                  </form>
                )
              ) : (
                <div className="space-y-2">
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
                        if (onOpenRFQ) onOpenRFQ({ title: 'Assisted Sourcing RFQ' });
                      }}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      Post RFQ
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
