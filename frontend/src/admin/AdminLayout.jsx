import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../zustand/store';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  Sun,
  Moon,
  PhoneCall,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore(state => state.user);
  const logoutUser = useStore(state => state.logoutUser);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard, badge: null },
    { label: 'Seller Approvals', path: '/admin/sellers', icon: Store, badge: 'Verification' },
    { label: 'Wholesale Catalog', path: '/admin/products', icon: Package, badge: null },
    { label: 'Orders & GMV', path: '/admin/orders', icon: ShoppingBag, badge: 'Escrow' },
    { label: 'Access Control', path: '/admin/users', icon: Users, badge: null },
  ];

  const currentNav = navItems.find(item => item.path === location.pathname) || { label: 'Admin Operations' };

  return (
    <div className="min-h-screen bg-theme-page text-theme-main font-poppins selection:bg-[#F59E0B] selection:text-slate-950 flex flex-col transition-colors duration-200">
      
      {/* 1. TOP UTILITY STRIP (Matches Main Navbar & MerchantNavbar) */}
      <div className="bg-[#172033] dark:bg-[#110B07] text-slate-300 dark:text-[#9CA3AF] text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800/80 dark:border-[#3A2A1F] z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 text-[#F59E0B] font-semibold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse shrink-0"></span>
              <span>Platform Governance & Executive Command Suite</span>
            </span>
            <span className="hidden lg:inline text-slate-600 dark:text-[#3A2A1F]">|</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-400 dark:text-[#9CA3AF] text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
              Multi-Tenant Governance Active
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs shrink-0 font-medium">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleDarkMode}
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

            {/* Direct Link to Storefront */}
            <Link 
              to="/" 
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition"
              title="Open Live Public Marketplace"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>

            <span className="hidden sm:inline text-slate-700 dark:text-[#3A2A1F]">|</span>
            <div className="flex items-center gap-1 text-slate-400 dark:text-[#9CA3AF]">
              <Globe className="w-3 h-3" />
              <span>INR (₹)</span>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* ===================== DESKTOP FIXED SIDEBAR ===================== */}
        <aside className="hidden lg:flex flex-col fixed inset-y-0 top-[33px] left-0 w-64 xl:w-72 bg-theme-sidebar border-r border-theme-border z-40">
          
          {/* Sidebar Brand Header */}
          <div className="h-16 px-5 border-b border-theme-border flex items-center justify-between gap-3">
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <img 
                src="/logo.png" 
                alt="RealBell" 
                className="h-8 w-auto bg-white/10 p-0.5 rounded-lg transition-transform group-hover:scale-105" 
              />
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight leading-none">
                  <span className="font-extrabold text-base text-theme-main">RealBell</span>
                  <span className="font-extrabold text-base text-[#F59E0B]">BizMart</span>
                </div>
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none mt-1">
                  Executive Admin
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live</span>
            </span>
          </div>

          {/* Sidebar Navigation Links */}
          <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
            
            {/* Section 1: Governance & Platform */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                Governance & Commerce
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                        : 'text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#F59E0B]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-theme-card text-theme-muted border border-theme-border'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Section 2: Quick Cross-Portal Access */}
            <div className="space-y-1.5 pt-3 border-t border-theme-border">
              <p className="px-3 text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                Cross-Portal Access
              </p>

              <Link
                to="/seller/dashboard"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-muted hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition group"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-[#F59E0B]" />
                  <span>Merchant Hub</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity text-[#F59E0B]" />
              </Link>

              <Link
                to="/user/dashboard"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/10 transition group"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-[#F59E0B]" />
                  <span>Buyer Dashboard</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                to="/"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/10 transition group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                  <span>Live Marketplace</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Section 3: System Status Card */}
            <div className="p-3.5 rounded-2xl bg-theme-card border border-theme-border space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-theme-main">
                  <Server className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>System Health</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">99.98%</span>
              </div>
              <p className="text-[10px] text-theme-muted leading-relaxed">
                Razorpay Escrow connected. RBAC multi-tenant isolation enforced.
              </p>
            </div>

          </div>

          {/* Sidebar Footer: User Brief & Logout */}
          <div className="p-4 border-t border-theme-border bg-theme-card/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-theme-main truncate leading-tight">
                  {user?.name || 'Super Admin'}
                </p>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase font-semibold">
                  {user?.role || 'admin'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition cursor-pointer shrink-0"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </aside>

        {/* ===================== MOBILE SIDEBAR DRAWER ===================== */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-[998]"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="lg:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-theme-sidebar border-r border-theme-border z-[999] flex flex-col font-poppins shadow-2xl"
              >
                <div className="h-16 px-5 border-b border-theme-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-theme-main">RealBell</span>
                    <span className="font-extrabold text-base text-[#F59E0B]">BizMart</span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-theme-muted hover:text-theme-main"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
                  <div className="space-y-1">
                    <p className="px-3 text-[10px] font-bold text-theme-muted uppercase tracking-wider mb-2">
                      Governance
                    </p>
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            isActive
                              ? 'bg-[#F59E0B] text-slate-950 font-bold'
                              : 'text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="space-y-1 pt-3 border-t border-theme-border">
                    <p className="px-3 text-[10px] font-bold text-theme-muted uppercase tracking-wider mb-2">
                      Portals
                    </p>
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-muted hover:text-[#F59E0B]"
                    >
                      <Store className="w-4 h-4 text-[#F59E0B]" />
                      <span>Merchant Panel</span>
                    </Link>
                    <Link
                      to="/user/dashboard"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-main"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#F59E0B]" />
                      <span>User Dashboard</span>
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-main"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                      <span>Live Marketplace</span>
                    </Link>
                  </div>
                </div>

                <div className="p-4 border-t border-theme-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-theme-main">{user?.name || 'Administrator'}</p>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-mono">{user?.role || 'admin'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ===================== MAIN CONTENT WRAPPER ===================== */}
        <div className="lg:pl-64 xl:pl-72 flex flex-col flex-1 min-h-screen">
          
          {/* Top Executive Header Bar */}
          <header className="h-16 bg-theme-card/90 backdrop-blur-md border-b border-theme-border sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-subtle border border-theme-border cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb & Section Identifier */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-theme-muted hidden sm:inline">Platform Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-theme-muted/60 hidden sm:inline" />
                <span className="font-bold text-theme-main text-sm sm:text-base">
                  {currentNav.label}
                </span>
              </div>
            </div>

            {/* Right Header Action Badges & Quick Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Direct Switch to Merchant Hub */}
              <Link
                to="/seller/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 bg-amber-500/10 border border-amber-500/25 transition cursor-pointer"
                title="Access Merchant Dashboard"
              >
                <Store className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Merchant Hub</span>
              </Link>

              {/* Direct Switch to User Dashboard */}
              <Link
                to="/user/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-theme-main hover:bg-[#F59E0B]/10 border border-theme-border transition cursor-pointer"
                title="Access Buyer Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Buyer Dashboard</span>
              </Link>

              {/* Direct Link to Marketplace */}
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-theme-main hover:bg-[#F59E0B]/10 border border-theme-border transition cursor-pointer"
                title="Open Public Marketplace Storefront"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden xs:inline">Marketplace</span>
                <ExternalLink className="w-3 h-3 text-theme-muted" />
              </Link>

              {/* Admin Avatar Chip */}
              <div className="flex items-center gap-2 pl-2 border-l border-theme-border">
                <div className="w-7 h-7 rounded-full bg-[#F59E0B] text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
              </div>

            </div>

          </header>

          {/* Content Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {children}
          </main>

          {/* Enterprise Admin Footer */}
          <footer className="border-t border-theme-border bg-theme-card/50 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-theme-muted flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              <span>RealBell BizMart Executive Governance Suite</span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Encrypted RBAC Session • Escrow Protected Marketplace
            </p>
          </footer>

        </div>
      </div>

    </div>
  );
};
