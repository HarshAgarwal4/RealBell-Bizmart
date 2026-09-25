import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, 
  Search, 
  Plus, 
  ShoppingBag, 
  Package, 
  Truck, 
  CreditCard, 
  User, 
  LogOut, 
  ExternalLink, 
  ChevronDown, 
  Menu, 
  X, 
  PhoneCall, 
  Globe, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Building2,
  Bell,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../zustand/store';

export const MerchantNavbar = ({ 
  activeTab, 
  onTabChange, 
  onAddProduct, 
  pendingShipments = 0,
  searchQuery = '',
  onSearchChange,
  darkMode,
  onToggleDarkMode
}) => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const logoutUser = useStore(state => state.logoutUser);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logoutUser();
    navigate('/login');
  };

  return (
    <header id="merchant-navbar" className="w-full bg-theme-card border-b border-theme-border sticky top-0 z-50 shadow-xs transition-colors duration-200">
      
      {/* 1. Top Utility Bar (Matches Main Navbar Aesthetic) */}
      <div className="bg-[#172033] dark:bg-[#110B07] text-slate-300 dark:text-[#9CA3AF] text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800/80 dark:border-[#3A2A1F]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 text-[#F59E0B] font-semibold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse shrink-0"></span>
              <span>Merchant & Wholesaler Management Portal</span>
            </span>
            <span className="hidden lg:inline text-slate-600 dark:text-[#3A2A1F]">|</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-400 dark:text-[#9CA3AF] text-xs">
              <PhoneCall className="w-3 h-3 text-[#F59E0B]" />
              Merchant Partner Desk: 1800-890-REAL
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs shrink-0 font-medium">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDarkMode}
              className="flex items-center gap-1 text-slate-300 dark:text-[#9CA3AF] hover:text-[#F59E0B] transition cursor-pointer px-2 py-0.5 rounded-md hover:bg-slate-800 dark:hover:bg-[#2A1E15]"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
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

            {/* Direct Link to View Marketplace */}
            <Link 
              to="/" 
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition"
              title="Open Live Marketplace as a Buyer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Browse Marketplace</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>

            <span className="hidden sm:inline text-slate-700 dark:text-[#3A2A1F]">|</span>

            {/* Direct Link to Buyer Dashboard */}
            <Link 
              to="/user/dashboard" 
              className="flex items-center gap-1 text-slate-300 dark:text-[#9CA3AF] hover:text-[#F59E0B] font-medium transition"
              title="Switch to Normal User Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline">Buyer Dashboard</span>
            </Link>

            <span className="hidden sm:inline text-slate-700 dark:text-[#3A2A1F]">|</span>
            <div className="flex items-center gap-1 text-slate-400 dark:text-[#9CA3AF]">
              <Globe className="w-3 h-3" />
              <span>INR (₹)</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Merchant Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Logo & Merchant Tag */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/seller/dashboard" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="RealBell BizMart" 
              className="h-8 sm:h-9 w-auto bg-white/10 p-0.5 rounded-lg transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <div className="flex items-center tracking-tight leading-none">
                <span className="font-extrabold text-base sm:text-lg text-theme-main">RealBell</span>
                <span className="font-extrabold text-base sm:text-lg text-[#F59E0B]">BizMart</span>
              </div>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none mt-0.5">
                Merchant Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar for Merchant: Search Inventory / Orders */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products, SKUs, or order IDs..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-theme-input border border-theme-border text-theme-main placeholder:text-theme-muted/60 focus:outline-none focus:border-[#F59E0B] transition"
            />
            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Marketplace Storefront Link Button */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-theme-border bg-theme-page hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-main transition cursor-pointer"
            title="Inspect Live Marketplace Storefront"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Storefront</span>
            <ExternalLink className="w-3 h-3 text-theme-muted" />
          </Link>

          {/* User / Buyer Dashboard Link Button */}
          <Link
            to="/user/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-theme-border bg-theme-page hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-main transition cursor-pointer"
            title="Switch to Normal User Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Buyer Mode</span>
          </Link>

          {/* Quick Add Product Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddProduct}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-2xs"
            title="Create New Product Listing"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </motion.button>

          {/* Inflow Orders / Pending Shipments Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange && onTabChange('orders')}
            className="relative p-2 text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 rounded-xl transition cursor-pointer"
            title="Inflow Orders"
          >
            <Truck className="w-5 h-5" />
            {pendingShipments > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-slate-950 font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-theme-card">
                {pendingShipments}
              </span>
            )}
          </motion.button>

          {/* Merchant Profile Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 bg-theme-page hover:bg-[#F59E0B]/8 dark:hover:bg-[#EAD9C4]/5 text-theme-main px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition border cursor-pointer ${
                dropdownOpen ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/20' : 'border-theme-border'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.sellerDetails?.shopName ? user.sellerDetails.shopName[0].toUpperCase() : (user?.name ? user.name[0].toUpperCase() : 'M')}
              </div>
              <span className="hidden md:inline max-w-[100px] truncate">
                {user?.sellerDetails?.shopName || user?.name || 'My Store'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-theme-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-theme-card border border-theme-border rounded-2xl shadow-xl p-1.5 z-50 overflow-hidden font-poppins"
                >
                  {/* Shop Details Header */}
                  <div className="p-3 bg-theme-page/60 rounded-xl mb-1 border border-theme-border/60">
                    <p className="text-xs font-bold text-theme-main truncate">
                      {user?.sellerDetails?.shopName || 'Wholesale Store'}
                    </p>
                    <p className="text-[11px] text-theme-muted truncate mt-0.5">
                      GSTIN: <span className="font-mono text-theme-main font-medium">{user?.sellerDetails?.gstNumber || 'Verified'}</span>
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Verified Wholesaler Account</span>
                    </div>
                  </div>

                  {/* 1. Dashboard Overview */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onTabChange && onTabChange('overview');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-[#F59E0B] text-slate-950 font-bold'
                        : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4" />
                      <span>Overview Dashboard</span>
                    </div>
                  </button>

                  {/* 2. Products */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onTabChange && onTabChange('products');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'products'
                        ? 'bg-[#F59E0B] text-slate-950 font-bold'
                        : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4" />
                      <span>Wholesale Catalog</span>
                    </div>
                  </button>

                  {/* 3. Orders */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onTabChange && onTabChange('orders');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'orders'
                        ? 'bg-[#F59E0B] text-slate-950 font-bold'
                        : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4" />
                      <span>Commercial Orders</span>
                    </div>
                    {pendingShipments > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-[#F59E0B]/20 text-[#F59E0B]">
                        {pendingShipments}
                      </span>
                    )}
                  </button>

                  {/* 4. Store Profile & Settings */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onTabChange && onTabChange('settings');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-[#F59E0B] text-slate-950 font-bold'
                        : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4" />
                      <span>Store Profile & GST</span>
                    </div>
                  </button>

                  <div className="my-1 border-t border-theme-border/70" />

                  {/* 5. User / Buyer Dashboard */}
                  <Link
                    to="/user/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-[#F59E0B]" />
                      <span>User Dashboard</span>
                    </div>
                    <span className="text-[10px] text-theme-muted font-normal">Buyer Hub</span>
                  </Link>

                  {/* 6. Switch to Normal Marketplace */}
                  <Link
                    to="/"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                      <span>View Marketplace</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-theme-muted" />
                  </Link>

                  <div className="my-1 border-t border-theme-border/70" />

                  {/* 6. Sign Out */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-theme-main hover:bg-theme-subtle border border-theme-border cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* 3. Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-theme-card border-b border-theme-border px-4 py-4 space-y-3 overflow-hidden font-poppins"
          >
            {/* Search */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products or orders..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-theme-input border border-theme-border text-theme-main focus:outline-none focus:border-[#F59E0B]"
              />
              <Search className="w-4 h-4 text-theme-muted absolute left-3 top-2.5" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onTabChange && onTabChange('overview'); }}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  activeTab === 'overview' ? 'bg-[#F59E0B] text-slate-950 border-[#F59E0B]' : 'border-theme-border text-theme-main'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onTabChange && onTabChange('products'); }}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  activeTab === 'products' ? 'bg-[#F59E0B] text-slate-950 border-[#F59E0B]' : 'border-theme-border text-theme-main'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onTabChange && onTabChange('orders'); }}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  activeTab === 'orders' ? 'bg-[#F59E0B] text-slate-950 border-[#F59E0B]' : 'border-theme-border text-theme-main'
                }`}
              >
                Orders ({pendingShipments})
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onTabChange && onTabChange('settings'); }}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  activeTab === 'settings' ? 'bg-[#F59E0B] text-slate-950 border-[#F59E0B]' : 'border-theme-border text-theme-main'
                }`}
              >
                Store Profile
              </button>
            </div>

            <div className="pt-2 border-t border-theme-border space-y-2">
              <Link
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 flex items-center justify-between text-xs font-bold border border-theme-border bg-theme-page text-theme-main rounded-xl hover:bg-[#F59E0B]/10 transition"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-[#F59E0B]" />
                  <span>Buyer / User Dashboard</span>
                </span>
                <span className="text-[10px] text-theme-muted font-normal">Normal View</span>
              </Link>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 flex items-center justify-between text-xs font-bold bg-[#F59E0B] text-slate-950 rounded-xl"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Marketplace Storefront</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-2 text-center text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
