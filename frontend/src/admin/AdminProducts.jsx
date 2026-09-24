import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
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
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/products');
      if (res.status === 200 && res.data.status === 1) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the marketplace?`)) return;
    try {
      const res = await axios.delete(`/seller/products/${id}`);
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Product removed by administrator");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const filtered = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const q = search.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || 
                          p.seller?.sellerDetails?.shopName?.toLowerCase().includes(q) ||
                          p.seller?.name?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Marketplace Catalog Management</h1>
            <p className="text-xs text-slate-400 mt-1">
              Oversee all listed wholesale inventory across registered suppliers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
              {products.length} Total Listings
            </span>
            <button
              onClick={fetchProducts}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, seller shop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {['all', 'apparel', 'uniforms', 'bags', 'stationery', 'drinkware', 'footwear', 'packaging'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading catalog items...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-950/60 rounded-3xl border border-slate-800 p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-300">No Products Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No products found matching your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div
                key={p._id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-900">
                    <img
                      src={p.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80"}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-slate-950/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {p.category}
                    </span>
                    {p.badge && (
                      <span className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-white line-clamp-1" title={p.title}>
                      {p.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Store className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">
                        {p.seller?.sellerDetails?.shopName || p.seller?.name || 'Verified Supplier'}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-850 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Wholesale Price</span>
                        <span className="text-sm font-bold text-amber-400">
                          ₹{p.price} <span className="text-[10px] text-slate-500 font-normal">/{p.unit || 'pc'}</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">MOQ / Stock</span>
                        <span className="text-slate-300 font-medium">
                          {p.moq || 1} MOQ • {p.stock || 0} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 border-t border-slate-850 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">ID: {p._id.slice(-6)}</span>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px]"
                    title="Delete product listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
