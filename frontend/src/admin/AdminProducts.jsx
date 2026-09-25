import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Link } from 'react-router-dom';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  Package, 
  Trash2, 
  Search, 
  Store, 
  Tag, 
  RefreshCw, 
  CheckCircle,
  ExternalLink,
  Layers,
  LayoutGrid,
  List,
  AlertCircle,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCardSkeleton, TableRowSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      await withSkeletonDelay();
      const res = await axios.get('/admin/products');
      if (res.status === 200 && res.data.status === 1) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load catalog products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the marketplace?`)) return;
    try {
      setDeletingId(id);
      const res = await axios.delete(`/seller/products/${id}`);
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Listing removed from platform catalog.");
        fetchProducts();
      } else {
        toast.error(res.data?.msg || "Failed to remove product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'apparel', label: 'Apparel' },
    { id: 'uniforms', label: 'Uniforms' },
    { id: 'bags', label: 'Bags' },
    { id: 'stationery', label: 'Stationery' },
    { id: 'drinkware', label: 'Drinkware' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'packaging', label: 'Packaging' }
  ];

  const filtered = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const q = search.toLowerCase();
    const title = p.title?.toLowerCase() || '';
    const shop = p.seller?.sellerDetails?.shopName?.toLowerCase() || '';
    const seller = p.seller?.name?.toLowerCase() || '';
    const matchesSearch = title.includes(q) || shop.includes(q) || seller.includes(q);
    return matchesCat && matchesSearch;
  });

  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const uniqueSellersCount = new Set(products.map(p => p.seller?._id || p.seller)).size;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* ===================== HEADER & SUMMARY ===================== */}
        <div className="bg-theme-card p-6 sm:p-7 rounded-3xl border border-theme-border shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-theme-main">Marketplace Catalog Management</h1>
              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {products.length} Active SKUs
              </span>
            </div>
            <p className="text-xs text-theme-muted">
              Audit listed wholesale inventory across suppliers, verify pricing compliance, and manage catalog availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2.5 sm:gap-3 bg-theme-page px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-theme-border text-xs">
              <div>
                <span className="text-[10px] text-theme-muted uppercase font-bold block">Aggregated Stock</span>
                <span className="font-bold text-theme-main font-mono text-xs sm:text-sm">{totalStockUnits.toLocaleString('en-IN')} units</span>
              </div>
              <span className="text-theme-border">|</span>
              <div>
                <span className="text-[10px] text-theme-muted uppercase font-bold block">Active Suppliers</span>
                <span className="font-bold text-[#F59E0B] font-mono text-xs sm:text-sm">{uniqueSellersCount} vendors</span>
              </div>
            </div>

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2.5 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border text-amber-600 dark:text-amber-400 rounded-xl transition cursor-pointer disabled:opacity-50"
              title="Refresh Products"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ===================== SEARCH, CATEGORIES & VIEW TOGGLE ===================== */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-theme-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, SKU, shop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted/60 focus:outline-hidden focus:border-[#F59E0B] transition"
            />
          </div>

          {/* View Toggle (Table vs Grid) */}
          <div className="flex items-center justify-end gap-2 w-full md:w-auto">
            <div className="bg-theme-card p-1 rounded-xl border border-theme-border flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#F59E0B] text-slate-950 font-bold' : 'text-theme-muted hover:text-theme-main'
                }`}
                title="Spreadsheet Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#F59E0B] text-slate-950 font-bold' : 'text-theme-muted hover:text-theme-main'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map(cat => {
            const count = cat.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  categoryFilter === cat.id
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-2xs'
                    : 'bg-theme-card text-theme-muted border border-theme-border hover:text-theme-main hover:bg-[#F59E0B]/10'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  categoryFilter === cat.id ? 'bg-slate-950 text-white' : 'bg-theme-card-subtle text-theme-muted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===================== CATALOG DISPLAY ===================== */}
        {loading ? (
          viewMode === 'table' ? (
            <div className="bg-theme-card rounded-3xl border border-theme-border shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-xs">
                  <tbody className="divide-y divide-theme-border">
                    <TableRowSkeleton rows={6} cols={6} />
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <ProductCardSkeleton count={8} viewMode="grid" />
            </div>
          )
        ) : filtered.length === 0 ? (
          <div className="bg-theme-card rounded-3xl border border-theme-border p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-theme-muted/50 mx-auto" />
            <h3 className="font-bold text-base text-theme-main">No Listings Match Filter</h3>
            <p className="text-xs text-theme-muted max-w-sm mx-auto">
              No products found matching your search query or selected category filter.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* ===================== TABLE VIEW ===================== */
          <div className="bg-theme-card rounded-3xl border border-theme-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-xs text-theme-main">
                <thead className="bg-theme-card-subtle text-theme-muted uppercase text-[10px] tracking-wider border-b border-theme-border font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Product & Category</th>
                    <th className="py-3.5 px-4">Wholesale Supplier</th>
                    <th className="py-3.5 px-4 text-right">Wholesale Price</th>
                    <th className="py-3.5 px-4 text-right">MOQ / Stock</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border font-medium">
                  {filtered.map(p => (
                    <tr key={p._id} className="hover:bg-[#F59E0B]/5 transition">
                      {/* Product & Category */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || p.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80"}
                            alt={p.title}
                            className="w-11 h-11 object-cover rounded-xl border border-theme-border shrink-0 bg-theme-page"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-theme-main truncate text-xs" title={p.title}>
                              {p.title}
                            </p>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 capitalize font-semibold">
                              {p.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Supplier */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-theme-main">
                          <Store className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {p.seller?.sellerDetails?.shopName || p.seller?.name || 'Verified Supplier'}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        ₹{Number(p.price).toLocaleString('en-IN')}
                        <span className="text-[10px] text-theme-muted font-normal block font-sans">
                          MRP: ₹{p.mrp || p.price}
                        </span>
                      </td>

                      {/* MOQ / Stock */}
                      <td className="py-3 px-4 text-right font-mono">
                        <span className="text-theme-main font-bold">{p.stock || 0}</span> in stock
                        <span className="text-[10px] text-theme-muted block font-sans">
                          Min. Order: {p.moq || 1} {p.unit || 'pcs'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          (p.stock || 0) > 0 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {(p.stock || 0) > 0 ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to="/"
                            className="p-1.5 text-theme-muted hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition"
                            title="Inspect on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.title)}
                            disabled={deletingId === p._id}
                            className="p-1.5 text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer disabled:opacity-50"
                            title="Remove Product from Marketplace"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ===================== GRID VIEW ===================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <div
                key={p._id}
                className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between transition group"
              >
                <div>
                  <div className="relative h-44 bg-theme-page overflow-hidden">
                    <img
                      src={p.images?.[0] || p.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-theme-card/90 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-theme-border">
                      {p.category}
                    </span>
                    {p.badge && (
                      <span className="absolute top-3 right-3 bg-[#F59E0B] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-theme-main line-clamp-1" title={p.title}>
                      {p.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-theme-muted">
                      <Store className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                      <span className="truncate">
                        {p.seller?.sellerDetails?.shopName || p.seller?.name || 'Verified Supplier'}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-theme-border text-xs">
                      <div>
                        <span className="text-[10px] text-theme-muted block">Wholesale Rate</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-[10px] text-theme-muted font-normal">/{p.unit || 'pc'}</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-theme-muted block">Inventory</span>
                        <span className="text-theme-main font-medium font-mono">
                          {p.stock || 0} units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-theme-page border-t border-theme-border flex items-center justify-between text-xs">
                  <span className="text-theme-muted font-mono text-[11px]">ID: #{p._id.slice(-6)}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/"
                      className="p-1.5 text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/10 rounded-lg transition"
                      title="Inspect Listing"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id, p.title)}
                      disabled={deletingId === p._id}
                      className="p-1.5 text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] disabled:opacity-50"
                      title="Remove product listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
