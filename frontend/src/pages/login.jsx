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
  LockKeyhole
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
      let res = await axios.post('/login', data);
      if (res.status === 200) {
        if (res.data.status === 5 || res.data.status === 9) return toast.error("Invalid email or password");
        if (res.data.status === 0) return toast.error("Something went wrong");
        if (res.data.status === 7) return toast.error("All fields are required");
        if (res.data.status === 1) {
          toast.success("Login successful! Welcome back.");
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
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Server connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-poppins flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Imagery & Ambient Gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80')"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/95 to-amber-950/40"></div>

      {/* Top Bar Navigation */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">New to RealBell?</span>
          <Link 
            to="/signup" 
            className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition"
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
        className="relative z-10 max-w-5xl w-full mx-auto bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-12"
      >
        {/* Left Column: Visual Brand Pitch (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/70 p-10 flex-col justify-between border-r border-slate-800/80 relative">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="RealBell BizMart Logo" 
                className="h-10 w-auto bg-white/10 p-1 rounded-xl"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-white">RealBell</span>
                <span className="text-xl font-bold text-amber-400">BizMart</span>
              </div>
            </Link>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                Verified B2B Gateway
              </span>
              <h2 className="text-2xl font-bold text-white leading-snug">
                Manage your wholesale orders & marketplace quotes in one place.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in to review live supplier RFQ responses, track bulk order shipments, and manage escrow disbursements.
              </p>
            </div>

            {/* Value checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>50,000+ Verified Wholesale Sellers</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Escrow Payment Protection</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time RFQ Bidding & Turnaround</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ISO 9001:2015 & Make in India Certified Platform</span>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-slate-900/60">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="RealBell" className="h-8 w-auto bg-white/10 p-1 rounded-lg" />
              <span className="text-lg font-bold text-white">RealBell</span>
              <span className="text-lg font-bold text-amber-400">BizMart</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome Back 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enter your credentials to access your buyer / supplier dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Email Address
              </label>
              <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden"
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  to='/forget-password'
                  className="text-xs text-amber-400 hover:text-amber-300 hover:underline transition font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters required" },
                  })}
                  className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-semibold text-sm rounded-xl shadow-lg hover:shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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

          {/* Footer Divider */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Don't have an enterprise account?{" "}
              <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-bold hover:underline">
                Create one now
              </Link>
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <LockKeyhole className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Secured Enterprise Connection</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;