import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Building, 
  Phone, 
  Mail, 
  User, 
  FileText,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const RFQModal = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Apparel & Garments',
    quantity: '500',
    unit: 'Pieces',
    targetPrice: '',
    customizations: ['Custom Logo Print', 'Custom Packaging'],
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    deliveryPincode: '',
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rfqId, setRfqId] = useState('');

  useEffect(() => {
    if (initialData?.title) {
      setFormData((prev) => ({
        ...prev,
        productName: initialData.title,
        category: initialData.categoryLabel || initialData.category || prev.category,
        quantity: initialData.moq ? initialData.moq.replace(/[^0-9]/g, '') || '500' : prev.quantity,
      }));
    }
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleCustomizationToggle = (option) => {
    setFormData((prev) => {
      const exists = prev.customizations.includes(option);
      return {
        ...prev,
        customizations: exists
          ? prev.customizations.filter((item) => item !== option)
          : [...prev.customizations, option],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productName || !formData.email || !formData.phone) {
      toast.error('Please fill in required fields: Product, Email, and Phone number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `RFQ-RB-${Math.floor(100000 + Math.random() * 900000)}`;
      setRfqId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('RFQ Submitted! Verified manufacturers will respond shortly.');
    }, 700);
  };

  const customizationOptions = [
    'Custom Logo Print / Screen Print',
    'Custom Embroidery',
    'Private Label / Tagging',
    'Custom Retail Packaging',
    'Sample Order First',
    'Eco-Friendly Material'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose}></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 my-auto text-slate-800 dark:text-slate-100 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-4 sm:p-6 relative">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Wholesale Request for Quotation (RFQ)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {isSubmitted ? 'Quotation Request Received!' : 'Request Direct Wholesale Quotes'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              RealBell BizMart connects your specifications directly to verified wholesalers and suppliers. Free of cost.
            </p>
          </div>

          {/* Content Body */}
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 text-center space-y-5"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  RFQ Reference Tracking Code
                </span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-wide mt-1">
                  {rfqId}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                  We have dispatched your inquiry for <strong className="text-slate-900 dark:text-white">{formData.productName}</strong> ({formData.quantity} {formData.unit}) to top-tier verified suppliers and wholesalers.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-700/50 rounded-xl p-3 sm:p-4 text-left max-w-lg mx-auto text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-300">
                  <Clock className="w-4 h-4 text-amber-600" />
                  What happens next?
                </div>
                <p>1. Sourcing specialists verify the specifications within 30 minutes.</p>
                <p>2. You will receive 3 to 5 competitive quotes via WhatsApp/Email ({formData.email}).</p>
                <p>3. Inspect samples, negotiate, and proceed with RealBell Escrow Protection.</p>
              </div>

              <div className="pt-2 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-8 py-3 rounded-xl transition cursor-pointer shadow-md text-sm"
                >
                  Done / Continue Browsing
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[70vh] sm:max-h-[75vh] overflow-y-auto">
              {/* Trust Banner */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-700 dark:text-slate-300 gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Zero buyer fee • Verified sellers • Escrow protection</span>
                </div>
                <span className="font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded text-[11px]">
                  Response &lt; 2h
                </span>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  1. Product & Order Requirements
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="e.g. Custom Polo T-Shirts, School Bags"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    >
                      <option value="Apparel & Garments">Apparel & Garments</option>
                      <option value="Corporate Uniforms">Corporate Uniforms</option>
                      <option value="Bags & Luggage">Bags & Luggage</option>
                      <option value="Corporate Gifting & Stationery">Corporate Gifting & Stationery</option>
                      <option value="Drinkware & Bottles">Drinkware & Bottles</option>
                      <option value="Industrial & Safety Gear">Industrial & Safety Gear</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Packaging & Custom Boxes">Packaging & Custom Boxes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    >
                      <option value="Pieces">Pieces (pcs)</option>
                      <option value="Sets">Sets</option>
                      <option value="Pairs">Pairs</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Meters">Meters</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Budget / Unit (₹)
                    </label>
                    <input
                      type="text"
                      value={formData.targetPrice}
                      onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                      placeholder="e.g. ₹250"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Customization Checkboxes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customization Required
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {customizationOptions.map((opt) => (
                      <label 
                        key={opt}
                        className={`flex items-center gap-2 p-2 border rounded-xl text-[11px] sm:text-xs cursor-pointer transition ${
                          formData.customizations.includes(opt) 
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200 font-semibold shadow-2xs' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.customizations.includes(opt)}
                          onChange={() => handleCustomizationToggle(opt)}
                          className="rounded text-amber-600 focus:ring-amber-500 shrink-0"
                        />
                        <span className="truncate">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Specifications
                  </label>
                  <textarea
                    rows="2"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Specify GSM, colors, dimensions, print technique, deadline..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  ></textarea>
                </div>
              </div>

              {/* Buyer Contact Information */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. Contact & Delivery Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Acme Corp / Retail Store"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rajesh@company.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Strict confidentiality & Escrow Protection</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting RFQ...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit RFQ & Get Quotes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RFQModal;
