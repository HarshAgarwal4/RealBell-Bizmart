import React, { useState, useEffect } from 'react';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Tag, 
  Layers, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCardSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';

export const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    description: '',
    category: 'apparel',
    saleType: 'both', // 'normal' | 'wholesale' | 'both'
    price: '', // Base / Normal retail price
    mrp: '',
    moq: 50,
    wholesaleTiers: [
      { minQty: 100, unitPrice: 20 },
      { minQty: 200, unitPrice: 19 }
    ],
    unit: 'pcs',
    stock: 1000,
    leadTime: '3-5 Business Days',
    badge: 'Verified Wholesale',
    image: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      await withSkeletonDelay();
      const res = await axios.get('/seller/products');
      if (res.status === 200 && res.data.status === 1) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your catalog");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setCurrentProductId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    const existingTiers = (prod.wholesaleTiers && prod.wholesaleTiers.length > 0)
      ? prod.wholesaleTiers
      : [
          { minQty: prod.moq || 100, unitPrice: Math.round(Number(prod.price) * 0.9) || 20 },
          { minQty: (prod.moq || 100) * 2, unitPrice: Math.round(Number(prod.price) * 0.8) || 19 }
        ];

    setFormData({
      title: prod.title,
      description: prod.description || '',
      category: prod.category || 'apparel',
      saleType: prod.saleType || 'both',
      price: prod.price || '',
      mrp: prod.mrp || '',
      moq: prod.moq || (existingTiers[0]?.minQty || 1),
      wholesaleTiers: existingTiers,
      unit: prod.unit || 'pcs',
      stock: prod.stock || 0,
      leadTime: prod.leadTime || '3-5 Business Days',
      badge: prod.badge || '',
      image: prod.images?.[0] || prod.image || ''
    });
    setIsEditing(true);
    setCurrentProductId(prod._id);
    setIsModalOpen(true);
  };

  const handleAddTier = () => {
    const current = formData.wholesaleTiers || [];
    const last = current[current.length - 1];
    const nextQty = last ? Number(last.minQty) + 100 : 100;
    const nextPrice = last ? Math.max(1, Number(last.unitPrice) - 1) : 20;
    setFormData({
      ...formData,
      wholesaleTiers: [...current, { minQty: nextQty, unitPrice: nextPrice }]
    });
  };

  const handleUpdateTier = (index, field, value) => {
    const updated = [...(formData.wholesaleTiers || [])];
    updated[index] = { ...updated[index], [field]: Number(value) };
    setFormData({ ...formData, wholesaleTiers: updated });
  };

  const handleRemoveTier = (index) => {
    const updated = (formData.wholesaleTiers || []).filter((_, i) => i !== index);
    setFormData({ ...formData, wholesaleTiers: updated });
  };

  const handleLoadExampleTiers = () => {
    setFormData({
      ...formData,
      wholesaleTiers: [
        { minQty: 100, unitPrice: 20 },
        { minQty: 200, unitPrice: 19 },
        { minQty: 500, unitPrice: 17 }
      ]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      toast.error("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    const validTiers = (formData.wholesaleTiers || [])
      .filter(t => t && Number(t.minQty) > 0 && Number(t.unitPrice) > 0)
      .map(t => ({ minQty: Number(t.minQty), unitPrice: Number(t.unitPrice) }))
      .sort((a, b) => a.minQty - b.minQty);

    const payload = {
      ...formData,
      saleType: formData.saleType,
      price: Number(formData.price),
      mrp: formData.mrp ? Number(formData.mrp) : Number(formData.price) * 1.5,
      moq: formData.saleType === 'normal' ? 1 : Number(formData.moq || (validTiers[0]?.minQty || 1)),
      stock: Number(formData.stock),
      wholesaleTiers: formData.saleType === 'normal' ? [] : validTiers,
      images: formData.image ? [formData.image] : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"]
    };

    try {
      if (isEditing) {
        const res = await axios.put(`/seller/products/${currentProductId}`, payload);
        if (res.status === 200 && res.data.status === 1) {
          toast.success("Product updated successfully!");
          setIsModalOpen(false);
          fetchSellerProducts();
        }
      } else {
        const res = await axios.post('/seller/products', payload);
        if (res.status === 200 && res.data.status === 1) {
          toast.success("Product listed successfully!");
          setIsModalOpen(false);
          fetchSellerProducts();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product from wholesale listings?")) return;
    try {
      const res = await axios.delete(`/seller/products/${id}`);
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Product deleted successfully");
        fetchSellerProducts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Inventory & Listings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add, update inventory, and manage your wholesale price tiers
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </motion.button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1">
          {['all', 'apparel', 'uniforms', 'bags', 'stationery', 'drinkware', 'footwear', 'packaging'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition ${
                selectedCategory === cat 
                  ? 'bg-amber-500 text-slate-950 font-bold' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table / Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCardSkeleton count={6} viewMode="grid" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base">No Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? "No products match your search query." : "You haven't listed any wholesale products yet."}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-2 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-600 transition"
          >
            List Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div 
              key={p._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80"}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {p.category}
                  </span>
                  {p.badge && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1" title={p.title}>
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {p.description}
                  </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {p.saleType === 'wholesale' ? 'Wholesale Price' : 'Price / Piece'}
                      </span>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        ₹{p.price} <span className="text-[10px] text-slate-500 font-normal">/{p.unit || 'pc'}</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Selling Format</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                        p.saleType === 'wholesale'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : p.saleType === 'normal'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {p.saleType === 'wholesale' ? 'Wholesale Only' : p.saleType === 'normal' ? 'Retail Only' : 'Both (Retail + Wholesale)'}
                      </span>
                    </div>
                  </div>

                  {/* Wholesale Tiers Preview Chip */}
                  {p.saleType !== 'normal' && p.wholesaleTiers && p.wholesaleTiers.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-[10px] text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold block text-slate-900 dark:text-slate-100">Wholesale Constraints:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.wholesaleTiers.map((t, tidx) => (
                          <span key={tidx} className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-medium">
                            {t.minQty}+ pcs @ <strong className="text-amber-600 dark:text-amber-400">₹{t.unitPrice}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Stock: <strong className="text-slate-700 dark:text-slate-300">{p.stock || 0}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Edit Product"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {isEditing ? "Edit Product Listing" : "List New Product"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* 1. SELLING FORMAT SELECTOR */}
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="block font-bold text-slate-900 dark:text-white text-xs">
                    Selling Mode / Purchasing Section *
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Choose whether you sell this item individually (normal retail), in bulk wholesale lots, or both.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {[
                      { id: 'normal', label: '🛍️ Normal Retail Only', desc: 'Single unit orders (MOQ 1)' },
                      { id: 'wholesale', label: '📦 Wholesale Only', desc: 'Bulk volume with tier constraints' },
                      { id: 'both', label: '🌟 Both (Normal + Wholesale)', desc: 'Retail + volume discounts' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, saleType: opt.id })}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          formData.saleType === opt.id
                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-amber-900 dark:text-amber-200'
                            : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                        }`}
                      >
                        <div className="font-bold text-xs">{opt.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 100% Bio-Washed Cotton Crew Neck T-Shirt"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 capitalize"
                    >
                      <option value="apparel">Apparel & Garments</option>
                      <option value="uniforms">Corporate Uniforms</option>
                      <option value="bags">Bags & Luggage</option>
                      <option value="stationery">Stationery & Gifts</option>
                      <option value="drinkware">Drinkware & Bottles</option>
                      <option value="footwear">Footwear & Safety</option>
                      <option value="home">Home & Living</option>
                      <option value="packaging">Packaging & Boxes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      {formData.saleType === 'wholesale' ? 'Base Wholesale Price (₹) *' : 'Normal / Retail Price (₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="180"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Retail MRP (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      placeholder="499"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Min Wholesale (MOQ)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                      placeholder={formData.saleType === 'normal' ? '1' : '50'}
                      disabled={formData.saleType === 'normal'}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Unit (e.g. pcs, sets)
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="pcs"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* 2. WHOLESALE TIER CONSTRAINTS BUILDER */}
                {formData.saleType !== 'normal' && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                          <span>📦 Wholesale Volume Constraints & Pricing Tiers</span>
                        </span>
                        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                          e.g. For 100 pcs - ₹20, 200 pcs - ₹19. Buyers must meet the tier quantity to get that rate.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadExampleTiers}
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 rounded-lg cursor-pointer transition"
                        >
                          Load Example Tiers
                        </button>
                        <button
                          type="button"
                          onClick={handleAddTier}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-950 bg-[#F59E0B] hover:bg-[#D97706] rounded-lg cursor-pointer transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Tier</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(formData.wholesaleTiers || []).map((tier, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/50 shadow-2xs"
                        >
                          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 w-14 shrink-0">
                            Tier {idx + 1}:
                          </span>

                          <div className="flex-1 flex items-center gap-1.5">
                            <label className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">Min Qty:</label>
                            <input
                              type="number"
                              min="1"
                              value={tier.minQty}
                              onChange={(e) => handleUpdateTier(idx, 'minQty', e.target.value)}
                              placeholder="100"
                              className="w-20 px-2 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center"
                            />
                            <span className="text-[11px] text-slate-400">{formData.unit || 'pcs'}</span>
                          </div>

                          <div className="flex-1 flex items-center gap-1.5">
                            <label className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">Rate / unit:</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-2 text-xs text-slate-400">₹</span>
                              <input
                                type="number"
                                min="1"
                                value={tier.unitPrice}
                                onChange={(e) => handleUpdateTier(idx, 'unitPrice', e.target.value)}
                                placeholder="20"
                                className="w-20 pl-5 pr-2 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-amber-700 dark:text-amber-300"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveTier(idx)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            title="Delete Tier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {(!formData.wholesaleTiers || formData.wholesaleTiers.length === 0) && (
                        <p className="text-[11px] text-slate-400 italic text-center py-2">
                          No wholesale tiers added yet. Click "+ Add Tier" or "Load Example Tiers" above.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="500"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Lead Time
                    </label>
                    <input
                      type="text"
                      value={formData.leadTime}
                      onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                      placeholder="e.g. 3-5 Business Days"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Wholesale Hot Deal"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Product Description *
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide technical specifications, fabric blend, packaging, or bulk tiers..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Saving..." : isEditing ? "Update Product" : "Publish to Marketplace"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
