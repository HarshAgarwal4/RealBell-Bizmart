import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  FileText, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  PhoneCall, 
  Globe, 
  Sparkles,
  Building2,
  Package,
  Layers,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../zustand/store';

const Navbar = ({ selectedCategory, onSelectCategory, darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart);
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);
  const cartCount = (cart || []).reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchScope, setSearchScope] = useState('Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'apparel', name: 'Apparel & Garments' },
    { id: 'uniforms', name: 'Corporate Uniforms' },
    { id: 'bags', name: 'Bags & Luggage' },
    { id: 'stationery', name: 'Stationery & Gifts' },
    { id: 'drinkware', name: 'Drinkware & Bottles' },
    { id: 'footwear', name: 'Footwear & Safety' },
    { id: 'home', name: 'Home & Living' },
    { id: 'packaging', name: 'Packaging & Boxes' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const element = document.getElementById('product-catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="app-navbar" className="w-full bg-theme-card border-b border-theme-border sticky top-0 z-50 shadow-xs transition-colors duration-200">
      {/* Top Global Utility Bar */}
      <div className="bg-[#172033] dark:bg-[#110B07] text-slate-300 dark:text-[#9CA3AF] text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800/80 dark:border-[#3A2A1F]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 text-[#F59E0B] font-semibold text-[11px] sm:text-xs truncate">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse shrink-0"></span>
              <span className="truncate">India's Premier Online Marketplace Platform</span>
            </span>
            <span className="hidden lg:inline text-slate-600 dark:text-[#3A2A1F]">|</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-400 dark:text-[#9CA3AF] text-xs">
              <PhoneCall className="w-3 h-3 text-[#F59E0B]" />
              1800-890-REAL (7325)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs shrink-0 font-medium">
            {/* Theme Toggle Button in Top Bar */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDarkMode}
              className="flex items-center gap-1 text-slate-300 dark:text-[#9CA3AF] hover:text-[#F59E0B] transition cursor-pointer px-2 py-0.5 rounded-md hover:bg-slate-800 dark:hover:bg-[#2A1E15]"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#F59E0B] animate-spin-slow" />
                  <span className="hidden xs:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-300" />
                  <span className="hidden xs:inline">Dark</span>
                </>
              )}
            </motion.button>

            <span className="text-slate-700 dark:text-[#3A2A1F]">|</span>
            <Link to={user?.role === 'seller' ? "/seller/dashboard" : "/signup?role=seller"} className="hidden sm:flex items-center gap-1 hover:text-[#F59E0B] transition">
              <Building2 className="w-3 h-3 text-[#F59E0B]" /> Become a Seller
            </Link>
            <span className="hidden sm:inline text-slate-700 dark:text-[#3A2A1F]">|</span>
            <div className="flex items-center gap-1 text-slate-400 dark:text-[#9CA3AF]">
              <Globe className="w-3 h-3" />
              <span>INR (₹)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <motion.img 
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
              src="/logo.png" 
              alt="RealBell BizMart Logo" 
              className="h-9 sm:h-11 w-auto object-contain bg-white/10 dark:bg-white/20 p-0.5 rounded-lg" 
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-theme-main group-hover:text-[#F59E0B] transition">
                  RealBell
                </span>
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-[#F59E0B]">
                  BizMart
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-theme-muted -mt-1 hidden xs:block">
                Online B2B Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar with Scope Dropdown */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearchSubmit} className="flex w-full rounded-xl border-2 border-[#F59E0B] overflow-hidden shadow-xs hover:shadow-md transition">
              {/* Scope Dropdown */}
              <div className="relative bg-theme-page border-r border-theme-border">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="h-full px-3.5 text-xs font-semibold text-theme-main flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition focus:outline-hidden whitespace-nowrap cursor-pointer"
                >
                  <span>{searchScope}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-theme-muted" />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-44 bg-theme-card border border-theme-border rounded-lg shadow-xl py-1 z-50 text-xs">
                    {['Products', 'Suppliers', 'Wholesalers', 'Bulk Deals'].map((scope) => (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => {
                          setSearchScope(scope);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#F59E0B] transition ${searchScope === scope ? 'font-bold text-[#F59E0B] bg-[#F59E0B]/10' : 'text-theme-main'}`}
                      >
                        {scope}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="relative flex-1 bg-theme-card flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, manufacturers, uniforms, custom apparel..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm text-theme-main placeholder:text-theme-muted focus:outline-hidden font-medium bg-transparent"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-6 flex items-center gap-2 transition cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span className="text-xs sm:text-sm font-semibold">Search</span>
              </motion.button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle Icon for Tablet/Desktop */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDarkMode}
              className="p-2 sm:p-2.5 text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 rounded-xl transition cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-[#F59E0B]" />
              ) : (
                <Moon className="w-5 h-5 text-theme-muted" />
              )}
            </motion.button>

            {/* Shopping Cart (Only visible when user is logged in) */}
            {user && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 rounded-xl transition cursor-pointer"
                title="Shopping Cart & Checkout"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-slate-950 font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-theme-card">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            )}

            {/* User Account / Auth */}
            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'admin' || user.role === 'super_admin') navigate('/admin');
                  else if (user.role === 'seller') navigate('/seller/dashboard');
                  else navigate('/user/dashboard');
                }}
                className="flex items-center gap-2 bg-theme-page hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 text-theme-main px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-theme-border cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline max-w-[80px] truncate">{user.name || 'Account'}</span>
                <span className="hidden lg:inline text-[10px] uppercase font-bold text-[#D97706] dark:text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">
                  {user.role || 'Buyer'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-theme-main hover:text-[#F59E0B] font-bold text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 transition cursor-pointer"
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="hidden md:inline-flex bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Register
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 rounded-xl transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mt-2 pt-1">
          <form onSubmit={handleSearchSubmit} className="flex rounded-xl border-2 border-[#F59E0B] overflow-hidden shadow-2xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, manufacturers..."
              className="w-full px-3 py-2 text-xs text-theme-main bg-theme-card placeholder:text-theme-muted focus:outline-hidden"
            />
            <button type="submit" className="bg-[#F59E0B] px-4 flex items-center justify-center text-slate-950 font-bold">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Category Sub-Navigation Strip (Desktop & Tablet) */}
      <nav className="bg-theme-page border-t border-theme-border hidden md:block transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-theme-main gap-1">
            <div className="flex items-center gap-1 shrink-0">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectCategory && onSelectCategory('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'all' || !selectedCategory 
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs' 
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-theme-main'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Categories</span>
              </motion.button>
            </div>

            <div className="h-4 w-px bg-theme-border mx-1 shrink-0"></div>

            <div className="flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
              {categories.slice(1).map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id 
                      ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-theme-main'
                  }`}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>

            <div className="h-4 w-px bg-theme-border mx-1 shrink-0"></div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                100% Verified Sellers
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu (with Framer Motion animation) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-theme-card border-b border-theme-border px-4 py-4 space-y-4 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-theme-muted">Appearance</span>
              <button
                onClick={onToggleDarkMode}
                className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-theme-page text-theme-main rounded-xl border border-theme-border"
              >
                {darkMode ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-theme-muted" />}
                <span>{darkMode ? "Light Theme" : "Dark Theme"}</span>
              </button>
            </div>

            <div>
              <div className="font-bold text-[11px] uppercase tracking-wider text-theme-muted mb-2">
                Browse Categories
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 text-xs rounded-xl transition ${
                      selectedCategory === cat.id 
                        ? 'bg-[#F59E0B] text-slate-950 font-bold' 
                        : 'bg-theme-page text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-theme-border space-y-2">
              {user ? (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-3 flex items-center justify-between text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>My Shopping Cart</span>
                    </span>
                    <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {cartCount} items
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (user.role === 'admin' || user.role === 'super_admin') navigate('/admin');
                      else if (user.role === 'seller') navigate('/seller/dashboard');
                      else navigate('/user/dashboard');
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 rounded-xl transition"
                  >
                    Go to {user.role === 'seller' ? 'Seller Hub' : user.role === 'admin' || user.role === 'super_admin' ? 'Admin Panel' : 'Buyer Dashboard'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                    className="py-2.5 text-center text-xs font-bold border border-theme-border text-theme-main rounded-xl hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                    className="py-2.5 text-center text-xs font-bold bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 rounded-xl transition"
                  >
                    Register Free
                  </button>
                </div>
              )}

              <div className="pt-2 text-center text-[11px] text-theme-muted flex items-center justify-center gap-1.5">
                <PhoneCall className="w-3 h-3 text-[#F59E0B]" />
                <span>Procurement Helpline: <strong>1800-890-REAL</strong></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;