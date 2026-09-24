import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { useStore } from '../zustand/store';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Store
} from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin');
      } else if (user.role === 'seller') {
        if (user.sellerStatus === 'approved') {
          navigate('/seller/dashboard');
        } else {
          navigate('/seller/apply');
        }
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      let res = await axios.post('/login', {
        email: data.email?.trim().toLowerCase(),
        password: data.password
      });
      if (res.data?.status === 1) {
        toast.success(res.data.msg || "Login successful! Welcome back.");
        const loggedUser = res.data.user;
        await fetchUser();
        if (loggedUser?.role === 'admin' || loggedUser?.role === 'super_admin') {
          navigate('/admin');
        } else if (loggedUser?.role === 'seller') {
          if (loggedUser?.sellerStatus === 'approved') {
            navigate('/seller/dashboard');
          } else {
            navigate('/seller/apply');
          }
        } else {
          navigate('/user/dashboard');
        }
      } else {
        toast.error(res.data?.msg || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errMsg = err.response?.data?.msg || err.message || "Server connection error. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-theme-page font-poppins flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      
      {/* Ambient Warm Gradient Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(217,119,6,0.05),transparent_50%)] pointer-events-none"></div>

      {/* Top Bar Navigation */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-theme-muted hover:text-[#F59E0B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-theme-muted hidden sm:inline">New to RealBell?</span>
          <Link 
            to="/signup" 
            className="text-xs sm:text-sm font-bold text-[#F59E0B] hover:text-[#D97706] transition"
          >
            Create an Account →
          </Link>
        </div>
      </div>

      {/* Main Container Card */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-5xl w-full mx-auto bg-theme-card border border-theme-border rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-12"
      >
        {/* Left Column: Visual Brand Pitch (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-theme-sidebar p-10 flex-col justify-between border-r border-theme-border relative">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="RealBell BizMart Logo" 
                className="h-10 w-auto bg-white/10 dark:bg-black/20 p-1 rounded-xl"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-theme-main">RealBell</span>
                <span className="text-xl font-bold text-[#F59E0B]">BizMart</span>
              </div>
            </Link>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[#D97706] dark:text-[#F59E0B] text-xs font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Verified B2B Gateway
              </span>
              <h2 className="text-2xl font-bold text-theme-main leading-snug">
                Manage your marketplace orders & shop in one place.
              </h2>
              <p className="text-xs text-theme-muted leading-relaxed">
                Log in to order trending products, track live shipments, or manage your seller store with secure payouts.
              </p>
            </div>

            {/* Value checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>10,000+ Verified Shopkeepers & Brands</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Razorpay Escrow Payment Safety</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pan-India Doorstep Express Delivery</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-theme-border">
            <div className="text-[11px] text-theme-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>ISO 9001:2015 & Make in India Certified Platform</span>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-theme-card">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="RealBell" className="h-8 w-auto bg-white/10 dark:bg-black/20 p-1 rounded-lg" />
              <span className="text-lg font-bold text-theme-main">RealBell</span>
              <span className="text-lg font-bold text-[#F59E0B]">BizMart</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-theme-main">
              Welcome Back 👋
            </h1>
            <p className="text-xs sm:text-sm text-theme-muted mt-1">
              Enter your credentials to access your buyer / supplier dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-theme-main mb-1.5">
                Business Email Address
              </label>
              <div className="relative rounded-xl border border-theme-border bg-theme-page focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-theme-main placeholder:text-theme-muted bg-transparent focus:outline-hidden"
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-theme-main">
                  Password
                </label>
                <Link
                  to='/forget-password'
                  className="text-xs text-[#F59E0B] hover:text-[#D97706] hover:underline transition font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative rounded-xl border border-theme-border bg-theme-page focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters required" },
                  })}
                  className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm text-theme-main placeholder:text-theme-muted bg-transparent focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-theme-muted hover:text-theme-main transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to RealBell BizMart</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Become a Seller / Register as Shopkeeper option */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#D97706] dark:text-[#F59E0B] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-theme-main">Sell on RealBell BizMart</h4>
                <p className="text-[11px] text-theme-muted">Register as a Shopkeeper or Wholesaler</p>
              </div>
            </div>
            <Link
              to="/signup?role=seller"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap shadow-md cursor-pointer flex items-center gap-1"
            >
              <span>Become a Seller</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Footer Divider */}
          <div className="mt-8 pt-6 border-t border-theme-border text-center">
            <p className="text-xs text-theme-muted">
              Don't have an enterprise account?{" "}
              <Link to="/signup" className="text-[#F59E0B] hover:text-[#D97706] font-bold hover:underline">
                Create one now
              </Link>
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-theme-muted">
              <LockKeyhole className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit SSL Secured Enterprise Connection</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;