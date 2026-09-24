import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from '../services/axios';
import { useStore } from "../zustand/store";
import { 
  User, 
  Mail, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  LockKeyhole,
  Check,
  Store
} from "lucide-react";
import { motion } from "framer-motion";

const SignupForm = () => {
  const user = useStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'user';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
    reset
  } = useForm();

  const email = watch("email");

  const onSubmit = async (data) => {
    if (!otpSent) {
      setError("otp", { type: "manual", message: "Please verify your email via OTP first." });
      toast.error("Please click 'Send OTP' to verify your business email.");
      return;
    }
    try {
      let res = await axios.post('/signup', {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
        password: data.password,
        otp: data.otp?.trim(),
        role: selectedRole
      });
      if (res.data?.status === 1) {
        toast.success(res.data.msg || (selectedRole === 'seller' ? "Shopkeeper account created! Please sign in to submit shop details." : "Account created successfully! Welcome to RealBell BizMart."));
        reset();
        navigate('/login');
      } else {
        toast.error(res.data?.msg || "Registration failed. Please check the details and try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errMsg = err.response?.data?.msg || err.message || "Server connection error. Please try again later.";
      toast.error(errMsg);
    }
  };

  const handleSendOtp = async () => {
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail) {
      setError("email", { type: "manual", message: "Please enter your email address first." });
      toast.warn("Please enter your email address first.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("email", { type: "manual", message: "Please enter a valid email address." });
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSendingOtp(true);
    try {
      let res = await axios.post('/sendotp', { email: cleanEmail });
      if (res.data?.status === 1) {
        toast.success(res.data.msg || `Verification OTP sent to ${cleanEmail}`);
        setOtpSent(true);
        clearErrors("email");
      } else {
        toast.error(res.data?.msg || "Failed to send verification code. Please try again.");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      const errMsg = err.response?.data?.msg || err.message || "Server connection error while sending OTP.";
      toast.error(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-page font-poppins flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      
      {/* Ambient Warm Gradient Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(217,119,6,0.05),transparent_50%)] pointer-events-none"></div>

      {/* Top Header Navigation */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-theme-muted hover:text-[#F59E0B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-theme-muted hidden sm:inline">Already registered?</span>
          <Link 
            to="/login" 
            className="text-xs sm:text-sm font-bold text-[#F59E0B] hover:text-[#D97706] transition"
          >
            Log In →
          </Link>
        </div>
      </div>

      {/* Main Registration Card */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-5xl w-full mx-auto bg-theme-card border border-theme-border rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-12"
      >
        {/* Left Column: Enterprise Benefits */}
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
                Free Enterprise Registration
              </span>
              <h2 className="text-2xl font-bold text-theme-main leading-snug">
                Join India's Most Trusted B2B Wholesale Marketplace
              </h2>
              <p className="text-xs text-theme-muted leading-relaxed">
                Connect directly with verified wholesale suppliers, distributors, and brands for merchandise, apparel, electronics, packaging, and bulk goods.
              </p>
            </div>

            {/* Platform Benefits Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Hidden Fees & 100% Genuine Marketplace Deals</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Business Profiles & Seller Verification</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Escrow Payment Release After QC Approval</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-theme-main">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Domestic & International Doorstep Logistics</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-theme-border">
            <div className="text-[11px] text-theme-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Make In India Partner • MSME Registered Platform</span>
            </div>
          </div>
        </div>

        {/* Right Column: Signup Form */}
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
              Create Account ✨
            </h1>
            <p className="text-xs sm:text-sm text-theme-muted mt-1">
              {selectedRole === 'seller' 
                ? 'Register your wholesale shop / manufacturing unit on RealBell'
                : 'Register as a buyer or enterprise procurement manager'}
            </p>
          </div>

          {/* Account Type Selector (Buyer vs Shopkeeper/Seller) */}
          <div className="mb-4 grid grid-cols-2 gap-2 p-1.5 bg-theme-page border border-theme-border rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'user'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-md'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Buyer Account</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('seller')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'seller'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-md'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shopkeeper / Seller</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-theme-main mb-1.5">
                Full Name *
              </label>
              <div className="relative rounded-xl border border-theme-border bg-theme-page focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  {...register("name", { required: "Full name is required" })}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-theme-main placeholder:text-theme-muted bg-transparent focus:outline-hidden"
                />
              </div>
              {errors.name && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address + Send OTP */}
            <div>
              <label className="block text-xs font-semibold text-theme-main mb-1.5">
                Business Email Address *
              </label>
              <div className="relative flex rounded-xl border border-theme-border bg-theme-page focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/20 transition overflow-hidden">
                <div className="pl-3.5 flex items-center pointer-events-none text-theme-muted">
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
                  className="flex-1 pl-3 pr-2 py-3 text-xs sm:text-sm text-theme-main placeholder:text-theme-muted bg-transparent focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="px-3.5 sm:px-4 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 my-1.5 mr-1.5 rounded-lg shrink-0 shadow-sm"
                >
                  {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* OTP Input (Shown after OTP is sent) */}
            {otpSent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#D97706] dark:text-[#F59E0B]">
                    Verification Code (OTP) *
                  </label>
                  <span className="text-[11px] text-emerald-500 font-medium">OTP Sent to Email</span>
                </div>
                <div className="relative rounded-xl border border-amber-500/70 bg-theme-page focus-within:ring-2 focus-within:ring-amber-500/30 transition">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#F59E0B]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 4-6 digit code"
                    {...register("otp", {
                      required: "OTP verification code is required",
                      minLength: {
                        value: 4,
                        message: "OTP must be at least 4 digits",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-theme-main placeholder:text-theme-muted bg-transparent focus:outline-hidden tracking-wider font-mono font-bold"
                  />
                </div>
                {errors.otp && (
                  <p className="text-rose-500 text-xs font-medium">{errors.otp.message}</p>
                )}
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-theme-main mb-1.5">
                Set Password *
              </label>
              <div className="relative rounded-xl border border-theme-border bg-theme-page focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
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

            {/* Terms notice */}
            <p className="text-[11px] text-theme-muted leading-relaxed pt-1">
              By registering, you agree to RealBell BizMart's{" "}
              <a href="#terms" className="text-[#F59E0B] hover:underline font-medium">Terms of Service</a>{" "}
              and{" "}
              <a href="#privacy" className="text-[#F59E0B] hover:underline font-medium">Privacy Policy</a>.
            </p>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>{selectedRole === 'seller' ? 'Register as Shopkeeper / Seller' : 'Create Buyer Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-theme-border text-center">
            <p className="text-xs text-theme-muted">
              Already have an enterprise account?{" "}
              <Link to="/login" className="text-[#F59E0B] hover:text-[#D97706] font-bold hover:underline">
                Sign In
              </Link>
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-theme-muted">
              <LockKeyhole className="w-3.5 h-3.5 text-emerald-500" />
              <span>Strict Data Protection & 256-Bit SSL Encrypted</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;
