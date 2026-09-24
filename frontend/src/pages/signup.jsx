import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
  Check
} from "lucide-react";
import { motion } from "framer-motion";

const SignupForm = () => {
  const user = useStore((state) => state.user);
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
      let res = await axios.post('/signup', data);
      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Error in creating account. Please try again.");
        if (res.data.status === 6) toast.error("This email is already registered.");
        if (res.data.status === 7) toast.error("Invalid fields provided.");
        if (res.data.status === 10) toast.error("Invalid or expired OTP. Please verify again.");
        if (res.data.status === 1) {
          toast.success("Account created successfully! Welcome to RealBell BizMart.");
          reset();
          navigate('/login');
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Server connection error. Please try again later.");
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("email", { type: "manual", message: "Please enter your email address first." });
      return;
    }
    setIsSendingOtp(true);
    let obj = { email };
    try {
      let res = await axios.post('/sendotp', obj);
      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Failed to send OTP. Please try again.");
        if (res.data.status === 7) toast.error("Invalid email address format.");
        if (res.data.status === 1) {
          toast.success(`Verification OTP sent to ${email}`);
          setOtpSent(true);
          clearErrors("email");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Server connection error while sending OTP.");
    }
    setIsSendingOtp(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-poppins flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80')"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/95 to-amber-950/40"></div>

      {/* Top Header Navigation */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Already registered?</span>
          <Link 
            to="/login" 
            className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition"
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
        className="relative z-10 max-w-5xl w-full mx-auto bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-12"
      >
        {/* Left Column: Enterprise Benefits */}
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
                Free Enterprise Registration
              </span>
              <h2 className="text-2xl font-bold text-white leading-snug">
                Join India's Most Trusted B2B Wholesale Marketplace
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with verified wholesale suppliers, distributors, and brands for merchandise, apparel, electronics, packaging, and bulk goods.
              </p>
            </div>

            {/* Platform Benefits Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Buyer Commission on RFQs</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Business Profiles & Seller Verification</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Escrow Payment Release After QC Approval</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Domestic & International Doorstep Logistics</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Make In India Partner • MSME Registered Platform</span>
            </div>
          </div>
        </div>

        {/* Right Column: Signup Form */}
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
              Create Account ✨
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Register as a buyer or enterprise supplier to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  {...register("name", { required: "Full name is required" })}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden"
                />
              </div>
              {errors.name && (
                <p className="text-rose-400 text-xs mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address + Send OTP */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Email Address *
              </label>
              <div className="relative flex rounded-xl border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition overflow-hidden">
                <div className="pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                  className="flex-1 pl-3 pr-2 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 my-1.5 mr-1.5 rounded-lg"
                >
                  {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1 font-medium">{errors.email.message}</p>
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
                  <label className="block text-xs font-semibold text-amber-400">
                    Verification Code (OTP) *
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">OTP Sent to Email</span>
                </div>
                <div className="relative rounded-xl border border-amber-500/70 bg-slate-800/90 focus-within:ring-2 focus-within:ring-amber-500/30 transition">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
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
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden tracking-wider font-mono font-bold"
                  />
                </div>
                {errors.otp && (
                  <p className="text-rose-400 text-xs font-medium">{errors.otp.message}</p>
                )}
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Set Password *
              </label>
              <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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

            {/* Terms notice */}
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              By registering, you agree to RealBell BizMart's{" "}
              <a href="#terms" className="text-amber-400 hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#privacy" className="text-amber-400 hover:underline">Privacy Policy</a>.
            </p>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-semibold text-sm rounded-xl shadow-lg hover:shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create RealBell Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an enterprise account?{" "}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold hover:underline">
                Sign In
              </Link>
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <LockKeyhole className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict Data Protection & 256-Bit SSL Encrypted</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;
