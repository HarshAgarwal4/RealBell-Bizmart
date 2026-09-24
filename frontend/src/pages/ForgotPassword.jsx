import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  Mail, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  LockKeyhole,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const newPassword = watch("newPassword");

  const handleSendOtp = async () => {
    if (!email) {
      setError("email", { type: "manual", message: "Please enter your email address first" });
      return;
    }
    setIsSendingOtp(true);
    try {
      let res = await axios.post('/sendotp', { email });
      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Failed to send verification code. Please try again.");
        if (res.data.status === 7) toast.error("Please enter a valid email address.");
        if (res.data.status === 1) {
          toast.success(`Verification code sent to ${email}`);
          setOtpSent(true);
          clearErrors("email");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Network error while sending OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "Passwords do not match." });
      return;
    }

    try {
      let res = await axios.post('/reset-password', {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword
      });

      if (res.status === 200) {
        if (res.data.status === 0) toast.error("Something went wrong. Please try again.");
        if (res.data.status === 7) toast.error("All fields are required.");
        if (res.data.status === 9) toast.error("No account found with this email address.");
        if (res.data.status === 10) toast.error("Invalid or expired OTP. Please verify again.");
        if (res.data.status === 1) {
          toast.success("Password reset successfully! Please sign in with your new password.");
          reset();
          navigate('/login');
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Server connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-poppins flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80')"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/95 to-amber-950/40"></div>

      {/* Top Header Navigation */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        <Link 
          to="/" 
          className="text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 transition"
        >
          Marketplace Home
        </Link>
      </div>

      {/* Main Container Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 max-w-4xl w-full mx-auto bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-12"
      >
        {/* Left Column: Security Info */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/70 p-8 lg:p-10 flex-col justify-between border-r border-slate-800/80">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="RealBell BizMart Logo" 
                className="h-9 w-auto bg-white/10 p-1 rounded-xl"
              />
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-white">RealBell</span>
                <span className="text-xl font-bold text-amber-400">BizMart</span>
              </div>
            </Link>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                Account Recovery
              </span>
              <h2 className="text-2xl font-bold text-white leading-snug">
                Reset your password securely with OTP
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Follow 2 simple steps: Verify your registered business email through a 6-digit OTP, then set your new password.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant email verification token</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted credential storage</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Immediate account access restored</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-500 flex items-center gap-2 font-normal">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>256-Bit SSL Protected Password Reset</span>
            </div>
          </div>
        </div>

        {/* Right Column: Reset Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-900/60">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              Reset Password 🔒
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-normal">
              Enter your registered email address to receive an OTP
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Step 1: Email + Send OTP */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Registered Email Address *
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
                  className="flex-1 pl-3 pr-2 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden font-normal"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 my-1.5 mr-1.5 rounded-lg shrink-0"
                >
                  {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1 font-normal">{errors.email.message}</p>
              )}
            </div>

            {/* Step 2: OTP + New Password (Shown after OTP is sent) */}
            {otpSent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 pt-1"
              >
                {/* OTP Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-amber-400">
                      Enter Verification Code (OTP) *
                    </label>
                    <span className="text-[11px] text-emerald-400 font-medium">Valid for 5 mins</span>
                  </div>
                  <div className="relative rounded-xl border border-amber-500/70 bg-slate-800/90 focus-within:ring-2 focus-within:ring-amber-500/30 transition">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP code"
                      {...register("otp", {
                        required: "OTP is required",
                        minLength: { value: 4, message: "OTP must be at least 4 digits" },
                      })}
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden tracking-wider font-mono font-semibold"
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-rose-400 text-xs mt-1 font-normal">{errors.otp.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    New Password *
                  </label>
                  <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: { value: 6, message: "Minimum 6 characters required" },
                      })}
                      className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-rose-400 text-xs mt-1 font-normal">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      {...register("confirmPassword", {
                        required: "Please confirm your new password",
                        validate: (val) => val === newPassword || "Passwords do not match",
                      })}
                      className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 bg-transparent focus:outline-hidden font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-rose-400 text-xs mt-1 font-normal">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Submit Action */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-semibold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
            >
              {isSubmitting ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>{otpSent ? "Reset Password & Continue" : "Send Verification OTP"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 font-normal">
              Remember your password?{" "}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-normal">
              <LockKeyhole className="w-3.5 h-3.5 text-emerald-400" />
              <span>RealBell BizMart Enterprise Identity Management</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
