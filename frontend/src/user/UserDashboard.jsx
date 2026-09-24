import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Store, 
  ChevronRight,
  CreditCard,
  Building2,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const logoutUser = useStore(state => state.logoutUser);
  const setIsCartOpen = useStore(state => state.setIsCartOpen);
  const cart = useStore(state => state.cart);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/user/orders');
      if (res.status === 200 && res.data.status === 1) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrdersCount = orders.filter(o => ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(o.orderStatus)).length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'delivered').length;
  const totalSpent = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-poppins py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-500/20">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">{user?.name || 'Valued Buyer'}</h1>
                <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Buyer Account
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user?.email} • Verified Wholesale Procurement Profile
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            </button>

            <Link
              to="/"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              Browse Catalog
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer border border-rose-200 dark:border-rose-900"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Orders</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Wholesale bookings</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Active Shipments</span>
              <Truck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeOrdersCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">In fulfillment or transit</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Delivered</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedOrdersCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Fulfilled successfully</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Spent</span>
              <CreditCard className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ₹{totalSpent.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Via Razorpay Escrow</div>
          </div>
        </div>

        {/* Seller Promo Card (If user is not seller) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Store className="w-4 h-4" />
              <span>Are you a Wholesaler, Shopkeeper, or Manufacturer?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
              Register your shop, submit your business documents for admin approval, and start listing your wholesale products to thousands of buyers across India!
            </p>
          </div>
          <Link
            to="/seller/apply"
            className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Become a Seller</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Recent Orders & Shipments</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track status updates and delivery timelines
              </p>
            </div>
            <Link
              to="/user/orders"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">No recent orders found</p>
              <Link
                to="/"
                className="mt-3 inline-block bg-slate-900 dark:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition font-semibold"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm">#{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        order.orderStatus === 'processing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {order.items?.length || 0} item(s) • ₹{Number(order.totalAmount).toLocaleString('en-IN')} • Paid via {order.paymentMethod?.toUpperCase()}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/user/track-order/${order._id}`)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
