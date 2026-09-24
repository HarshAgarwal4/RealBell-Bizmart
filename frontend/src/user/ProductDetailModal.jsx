import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingCart, 
  Zap, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Package, 
  CheckCircle2, 
  Store, 
  Heart, 
  Share2, 
  Plus, 
  Minus,
  Check,
  Building2,
  Info,
  ChevronLeft,
  ChevronRight,
  Images
} from 'lucide-react';
import { toast } from 'react-toastify';

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, onBuyNow }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'delivery'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setCurrentImgIndex(0);
      setQuantity(product.moq || 1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const imagesList = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'];

  const selectedImage = imagesList[currentImgIndex] || imagesList[0];

  const handlePrevImg = (e) => {
    e?.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    e?.stopPropagation();
    setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const discountPercent = product.mrp && product.price && product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : (product.discount ? parseInt(product.discount) : 0);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Product link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQtyChange = (delta) => {
    const minQty = 1;
    const newQty = quantity + delta;
    if (newQty >= minQty) {
      setQuantity(newQty);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:p-6 overflow-y-auto font-poppins">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-theme-card border border-theme-border rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col text-theme-main"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-theme-border bg-theme-page shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B] border border-[#F59E0B]/20 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {product.categoryLabel || product.category || 'Marketplace'}
              </span>
              {product.badge && (
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Share Product"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1">
            <div className="grid md:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Multi-Image Preview Gallery */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden group">
                  <img
                    src={selectedImage}
                    alt={`${product.title} - angle ${currentImgIndex + 1}`}
                    className="w-full h-full object-cover transition duration-300"
                  />

                  {/* Left / Right Carousel Arrow Buttons */}
                  {imagesList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImg}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition shadow-md cursor-pointer opacity-80 hover:opacity-100"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImg}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition shadow-md cursor-pointer opacity-80 hover:opacity-100"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                    {discountPercent > 0 && (
                      <span className="bg-rose-500 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-md shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Photo Counter Badge */}
                  <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Images className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentImgIndex + 1} / {imagesList.length}</span>
                  </span>
                </div>

                {/* Thumbnails Strip with Multi-Angle Previews */}
                {imagesList.length > 1 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                      <span>Click thumbnail to switch angle:</span>
                      <span>{imagesList.length} photos available</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {imagesList.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentImgIndex(idx)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                            currentImgIndex === idx 
                              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xs scale-102' 
                              : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                          {currentImgIndex === idx && (
                            <span className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust Badges under Image */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-slate-600 dark:text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-[11px] font-medium leading-tight">Express Doorstep Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <RotateCcw className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-[11px] font-medium leading-tight">7-Day Easy Replacement</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Product Info & Actions */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Title & Ratings */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {product.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold border border-amber-200 dark:border-amber-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating || '4.8'}</span>
                    </div>
                    <span className="text-slate-400">
                      ({(product.reviews || 840).toLocaleString('en-IN')} ratings & verified reviews)
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                    </span>
                  </div>
                </div>

                {/* Price Box */}
                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                    {product.mrp && (
                      <span className="text-sm sm:text-base text-slate-400 line-through">
                        ₹{Number(product.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-md">
                        Save ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({discountPercent}% OFF)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inclusive of all GST & taxes • Free delivery across India on orders
                  </p>
                </div>

                {/* Seller & Shopkeeper Info Card */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
                      <Store className="w-5 h-5 text-slate-950" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {product.sellerName || product.shopName || "RealBell Verified Partner"}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" title="Verified GSTIN Shopkeeper" />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Authorized Marketplace Wholesaler • Ships within 24h
                      </span>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                    Direct Seller
                  </span>
                </div>

                {/* Quantity Selector & Total Price */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden w-fit shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-bold text-slate-900 dark:text-white">
                        {quantity} {product.unit || 'pcs'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(1)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Subtotal</span>
                    <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      ₹{(Number(product.price) * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl border-2 border-amber-500 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onBuyNow(product, quantity);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Buy Now</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Tabs Section: Overview, Specs, Shipping */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Overview & Features
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'specs'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('delivery')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'delivery'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Shipping & Escrow Protection
                </button>
              </div>

              <div className="pt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <p>
                      {product.description || "Premium quality merchandise built for consumer & corporate reliability. Specially designed with high durability standards, skin-friendly materials, and rigorous quality inspection before dispatch."}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2 pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>100% Genuine and authentic manufacturer guarantee</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Ready stock with quick dispatch within 24-48 hours</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Standard warranty & verified return policy included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Direct GST invoice generated with full input tax credit</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-medium">Category</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{product.categoryLabel || product.category || 'General'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-medium">Measurement Unit</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{product.unit || 'pcs'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-medium">Inventory Stock</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{product.stock ? `${product.stock} units` : 'In Stock'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-medium">Lead / Dispatch Time</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{product.leadTime || '1-2 Days'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-medium">Payment Escrow</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Razorpay Protected</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-medium">Origin</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Made in India 🇮🇳</span>
                    </div>
                  </div>
                )}

                {activeTab === 'delivery' && (
                  <div className="space-y-3">
                    <p>
                      Orders placed on RealBell BizMart are processed via our verified logistics partners (Delhivery, Blue Dart, Express Courier). Payment is held safely in Razorpay escrow until shipment delivery is confirmed.
                    </p>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>RealBell Buyer Assurance:</strong> 100% money back guarantee if the item received does not match the description or arrives in damaged condition.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
