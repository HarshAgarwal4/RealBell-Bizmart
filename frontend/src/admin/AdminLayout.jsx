import React from 'react';
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
  ChevronRight
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore(state => state.user);
  const logoutUser = useStore(state => state.logoutUser);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Seller Approvals', path: '/admin/sellers', icon: Store },
    { label: 'All Products', path: '/admin/products', icon: Package },
    { label: 'Orders & GMV', path: '/admin/orders', icon: ShoppingBag },
    { label: 'User Management', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-poppins flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="RealBell" className="h-8 w-auto bg-white/10 p-0.5 rounded-lg" />
              <div className="flex items-center">
                <span className="font-bold text-base text-white">RealBell</span>
                <span className="font-bold text-base text-amber-500">BizMart</span>
              </div>
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Control Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-amber-400 uppercase font-mono font-semibold">{user?.role || 'admin'}</span>
            </div>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white py-1.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 transition"
            >
              <span>Marketplace</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Secondary Subnav Strip */}
        <div className="border-t border-slate-800/80 bg-slate-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-2 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
