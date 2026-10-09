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
import { calculateWholesaleTierPrice } from '../zustand/store';
import { toast } from 'react-toastify';

export const getProductTiers = (prod) => {
  if (prod?.wholesaleTiers && prod.wholesaleTiers.length > 0) {
    return [...prod.wholesaleTiers].sort((a, b) => a.minQty - b.minQty);
  }
  const baseMoq = prod?.moq || 50;
  const basePrice = Number(prod?.price) || 200;
  return [
    { minQty: baseMoq, unitPrice: Math.round(basePrice * 0.85) },
    { minQty: baseMoq * 2, unitPrice: Math.round(basePrice * 0.75) },
    { minQty: baseMoq * 5, unitPrice: Math.round(basePrice * 0.65) }
  ];
};

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, onBuyNow }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'delivery'
  const [copied, setCopied] = useState(false);

  // 2 Purchasing Sections: 'normal' vs 'wholesale'
  const canNormal = product?.saleType !== 'wholesale';
  const canWholesale = product?.saleType !== 'normal';

  const [purchaseMode, setPurchaseMode] = useState('normal'); // 'normal' | 'wholesale'
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setCurrentImgIndex(0);
      const isWholesaleDefault = product.saleType === 'wholesale';
      const initialMode = isWholesaleDefault ? 'wholesale' : 'normal';
      setPurchaseMode(initialMode);
      if (initialMode === 'wholesale') {
        const tiers = getProductTiers(product);
        setQuantity(tiers[0]?.minQty || product.moq || 50);
      } else {
        setQuantity(1);
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const imagesList = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'];

  const selectedImage = imagesList[currentImgIndex] || imagesList[0];

  const tiers = getProductTiers(product);
  const minWholesaleQty = tiers[0]?.minQty || product.moq || 10;

  // Active Tier calculation
  const activeWholesaleTier = tiers.reduce((best, t) => {
    if (quantity >= t.minQty) return t;
    return best;
  }, tiers[0]);

  // Find next tier for discount nudge
  const nextTier = tiers.find(t => t.minQty > quantity);

  const currentUnitPrice = purchaseMode === 'wholesale'
    ? calculateWholesaleTierPrice({ ...product, wholesaleTiers: tiers }, quantity)
    : Number(product.price);

  const subtotal = currentUnitPrice * quantity;

  const handleModeSwitch = (mode) => {
    if (mode === purchaseMode) return;
    setPurchaseMode(mode);
    if (mode === 'wholesale') {
      setQuantity(Math.max(quantity, minWholesaleQty));
    } else {
      setQuantity(1);
    }
  };

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
    const minQty = purchaseMode === 'wholesale' ? minWholesaleQty : 1;
    const newQty = quantity + delta;
    if (newQty >= minQty) {
      setQuantity(newQty);
    } else {
      if (purchaseMode === 'wholesale') {
        toast.warning(`Minimum wholesale constraint is ${minQty} ${product.unit || 'pcs'}`);
      }
    }
  };

  const handleSetDirectQty = (val) => {
    const num = parseInt(val) || 0;
    const minQty = purchaseMode === 'wholesale' ? minWholesaleQty : 1;
    if (num >= minQty) {
      setQuantity(num);
    } else {
      setQuantity(minQty);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto font-poppins">
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
              <div className="md:col-span-7 space-y-4">
                
                {/* Title & Ratings */}
                <div className="space-y-1.5">
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

                {/* 2 Purchasing Sections Switcher */}
                <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('normal')}
                    disabled={!canNormal}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      purchaseMode === 'normal'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700 ring-2 ring-amber-500/20'
                        : canNormal
                          ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          : 'opacity-40 cursor-not-allowed text-slate-400'
                    }`}
                  >
                    <span>🛍️ Normal Purchase</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      Retail
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeSwitch('wholesale')}
                    disabled={!canWholesale}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      purchaseMode === 'wholesale'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700 ring-2 ring-amber-500/20'
                        : canWholesale
                          ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          : 'opacity-40 cursor-not-allowed text-slate-400'
                    }`}
                  >
                    <span>📦 Wholesale Purchase</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold">
                      Bulk Tiers
                    </span>
                  </button>
                </div>

                {/* SECTION 1: NORMAL PURCHASE */}
                {purchaseMode === 'normal' && (
                  <div className="space-y-3.5 p-4 rounded-2xl bg-theme-page border border-theme-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B]">
                          Individual / Retail Pricing
                        </span>
                        <div className="flex items-baseline gap-2.5 mt-0.5">
                          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            / {product.unit || 'piece'}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{Number(product.mrp).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-theme-main bg-theme-card px-2.5 py-1 rounded-lg border border-theme-border">
                        MOQ: 1 {product.unit || 'pc'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Personal or retail purchase with no minimum order constraint. Ships directly with standard individual warranty and doorstep delivery.
                    </p>

                    {canWholesale && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                        <span className="text-amber-800 dark:text-amber-300 font-medium">
                          Ordering {minWholesaleQty}+ units? Switch to Wholesale for bulk tier rates!
                        </span>
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('wholesale')}
                          className="text-amber-600 dark:text-amber-400 font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                        >
                          View Tiers →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 2: WHOLESALE PURCHASE WITH CONSTRAINTS */}
                {purchaseMode === 'wholesale' && (
                  <div className="space-y-3.5 p-4 rounded-2xl bg-theme-page border border-theme-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B] flex items-center gap-1.5">
                          <span>Wholesale Tiered Constraints</span>
                          <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded-sm text-[10px] font-extrabold border border-amber-500/20">
                            B2B Pricing
                          </span>
                        </span>
                        <div className="flex items-baseline gap-2.5 mt-0.5">
                          <span className="text-2xl sm:text-3xl font-extrabold text-theme-main">
                            ₹{currentUnitPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            / {product.unit || 'piece'}
                          </span>
                          <span className="text-xs font-semibold text-[#D97706] dark:text-[#F59E0B] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            Bulk Tier Applied
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Wholesale Constraint</span>
                        <span className="text-xs font-bold text-theme-main bg-theme-card px-2.5 py-1 rounded-lg border border-theme-border inline-block">
                          Min: {minWholesaleQty} {product.unit || 'pcs'}
                        </span>
                      </div>
                    </div>

                    {/* Tier Constraint Cards / Grid */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-0.5">
                        <span>Wholesale Volume Constraints (Click to set):</span>
                        <span>Unit Rate</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tiers.map((t, idx) => {
                          const isCurrentActive = activeWholesaleTier?.minQty === t.minQty;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setQuantity(t.minQty)}
                              className={`p-3 rounded-xl border text-left transition cursor-pointer relative ${
                                isCurrentActive
                                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-500/30 font-bold'
                                  : 'bg-theme-card hover:bg-theme-card-subtle border-theme-border text-theme-main'
                              }`}
                            >
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span>{t.minQty}+ {product.unit || 'pcs'}</span>
                                {isCurrentActive && (
                                  <span className="text-[9px] bg-slate-950/20 text-slate-950 px-1.5 py-0.2 rounded-sm font-extrabold tracking-wider">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className={`text-base font-black mt-1 ${isCurrentActive ? 'text-slate-950' : 'text-[#D97706] dark:text-[#F59E0B]'}`}>
                                ₹{t.unitPrice} <span className="text-[10px] font-normal opacity-80">/{product.unit || 'pc'}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Next Tier Nudge */}
                    {nextTier && (
                      <div className="text-[11px] text-theme-main bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center justify-between">
                        <span>
                          💡 Order <strong>{nextTier.minQty - quantity}</strong> more {product.unit || 'pcs'} to unlock <strong>₹{nextTier.unitPrice}/{product.unit || 'pc'}</strong>!
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(nextTier.minQty)}
                          className="font-bold underline text-[#D97706] dark:text-[#F59E0B] ml-1 cursor-pointer shrink-0"
                        >
                          Upgrade to {nextTier.minQty} pcs
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Seller & Shopkeeper Info Card */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-theme-border bg-theme-page">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
                      <Store className="w-4 h-4 text-slate-950" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {product.sellerName || product.shopName || "RealBell Verified Partner"}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" title="Verified GSTIN Shopkeeper" />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Authorized Seller • Ships in {product.leadTime || "2-3 Days"}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                    Direct Seller
                  </span>
                </div>

                {/* Quantity Selector & Total Price */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {purchaseMode === 'wholesale' ? 'Wholesale Quantity:' : 'Quantity:'}
                      </label>
                      {purchaseMode === 'wholesale' && (
                        <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-semibold">
                          (Min constraint: {minWholesaleQty})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center border border-theme-border rounded-xl bg-theme-page overflow-hidden w-fit shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(purchaseMode === 'wholesale' ? -10 : -1)}
                        disabled={quantity <= (purchaseMode === 'wholesale' ? minWholesaleQty : 1)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-30 cursor-pointer"
                        title={quantity <= (purchaseMode === 'wholesale' ? minWholesaleQty : 1) ? "Minimum quantity reached" : "Decrease"}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      
                      <input
                        type="number"
                        min={purchaseMode === 'wholesale' ? minWholesaleQty : 1}
                        value={quantity}
                        onChange={(e) => handleSetDirectQty(e.target.value)}
                        className="w-16 text-center text-xs font-bold text-slate-900 dark:text-white bg-transparent outline-none py-1"
                      />

                      <span className="pr-3 text-xs text-slate-400 font-medium">
                        {product.unit || 'pcs'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleQtyChange(purchaseMode === 'wholesale' ? 10 : 1)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Amount</span>
                    <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (@ ₹{currentUnitPrice} / {product.unit || 'pc'})
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, quantity, purchaseMode);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl border-2 border-amber-500 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart ({purchaseMode === 'wholesale' ? 'Wholesale' : 'Normal'})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onBuyNow(product, quantity, purchaseMode);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Buy Now ({purchaseMode === 'wholesale' ? 'Wholesale' : 'Normal'})</span>
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
