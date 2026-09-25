import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartModal } from '../user/CartModal';
import { 
  Building2, 
  Store, 
  FileText, 
  CreditCard, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", 
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const CATEGORIES = [
  { id: 'apparel', label: 'Apparel & Garments' },
  { id: 'uniforms', label: 'Corporate Uniforms & Workwear' },
  { id: 'bags', label: 'Bags & Luggage' },
  { id: 'stationery', label: 'Stationery & Corporate Gifts' },
  { id: 'drinkware', label: 'Drinkware & Flasks' },
  { id: 'footwear', label: 'Footwear & Safety Gear' },
  { id: 'home', label: 'Home, Kitchen & Living' },
  { id: 'packaging', label: 'Packaging, Cartons & Boxes' }
];

export const SellerApprovalForm = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const fetchUser = useStore(state => state.fetchUser);

  useEffect(() => {
    if (user?.role === 'seller') {
      navigate('/seller/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      shopName: user?.sellerDetails?.shopName || user?.companyName || '',
      gstNumber: user?.sellerDetails?.gstNumber || user?.gstin || '',
      businessCategory: user?.sellerDetails?.businessCategory || 'apparel',
      phone: user?.sellerDetails?.phone || user?.phone || '',
      address: user?.sellerDetails?.address || user?.address?.addressLine || '',
      city: user?.sellerDetails?.city || user?.address?.city || '',
      state: user?.sellerDetails?.state || user?.address?.state || '',
      pincode: user?.sellerDetails?.pincode || user?.address?.pincode || '',
      bankAccount: user?.sellerDetails?.bankAccount || '',
      ifscCode: user?.sellerDetails?.ifscCode || '',
      upiId: user?.sellerDetails?.upiId || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/seller/apply', data);
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Merchant application submitted successfully! Under review.");
        await fetchUser();
        navigate('/seller/dashboard');
      } else {
        toast.error(res.data.msg || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting seller application. Please check your network and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-theme-page text-theme-main font-poppins flex flex-col selection:bg-[#F59E0B] selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-theme-muted">
            <Link to="/" className="hover:text-[#F59E0B] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/user/dashboard" className="hover:text-[#F59E0B] transition">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-theme-main font-semibold">Merchant Registration</span>
          </div>

          <Link
            to="/user/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-main transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-br from-amber-500/15 via-theme-card to-theme-card border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#F59E0B] text-slate-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3 h-3" /> Merchant Onboarding
                </span>
                <span className="text-xs text-theme-muted">
                  Fast 24-Hour Approval
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-theme-main tracking-tight flex items-center gap-2.5">
                <Store className="w-7 h-7 sm:w-8 h-8 text-[#F59E0B]" />
                <span>Merchant & Wholesaler Registration</span>
              </h1>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                Register your business on RealBell BizMart. Once approved by our team, your wholesale merchant dashboard will unlock with direct catalog listing and verified supplier access.
              </p>
            </div>

            {/* Quick Benefits Badges */}
            <div className="grid grid-cols-2 gap-2 w-full lg:w-auto shrink-0">
              <div className="flex items-center gap-2 bg-theme-page/80 border border-theme-border rounded-xl p-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-theme-main text-[11px]">Zero Listing Fees</span>
              </div>
              <div className="flex items-center gap-2 bg-theme-page/80 border border-theme-border rounded-xl p-2.5 text-xs">
                <TrendingUp className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span className="font-semibold text-theme-main text-[11px]">Direct Bulk Orders</span>
              </div>
              <div className="flex items-center gap-2 bg-theme-page/80 border border-theme-border rounded-xl p-2.5 text-xs">
                <CreditCard className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-semibold text-theme-main text-[11px]">Razorpay Payouts</span>
              </div>
              <div className="flex items-center gap-2 bg-theme-page/80 border border-theme-border rounded-xl p-2.5 text-xs">
                <Award className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="font-semibold text-theme-main text-[11px]">Verified Merchant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section 1: Shop & Business Identification */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-[#F59E0B] font-bold text-sm border-b border-theme-border pb-3">
              <Building2 className="w-4 h-4" />
              <span className="text-theme-main">1. Business & Store Identification</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shop / Business Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main block">
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Wholesale Enterprises"
                  {...register("shopName", { required: "Shop or business name is required" })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted/60 focus:outline-none focus:border-[#F59E0B] transition font-medium"
                />
                {errors.shopName && (
                  <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.shopName.message}</span>
                  </p>
                )}
              </div>

              {/* Primary Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main block">
                  Primary Wholesale Category *
                </label>
                <select
                  {...register("businessCategory", { required: "Category is required" })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main focus:outline-none focus:border-[#F59E0B] transition font-medium"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* GSTIN */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main flex items-center justify-between">
                  <span>GST Identification Number (GSTIN) *</span>
                  <span className="text-[10px] text-theme-muted">15 Characters</span>
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  {...register("gstNumber", { required: "Valid GST number is required for merchant verification" })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main uppercase font-mono tracking-wider focus:outline-none focus:border-[#F59E0B] transition font-semibold"
                />
                {errors.gstNumber && (
                  <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.gstNumber.message}</span>
                  </p>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main block">
                  Business Phone / WhatsApp *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-theme-muted font-mono font-semibold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    {...register("phone", { 
                      required: "Phone number is required",
                      minLength: { value: 10, message: "Must be a 10-digit number" }
                    })}
                    className="w-full pl-12 pr-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main font-mono focus:outline-none focus:border-[#F59E0B] transition font-medium"
                  />
                </div>
                {errors.phone && (
                  <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Warehouse Location */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-[#F59E0B] font-bold text-sm border-b border-theme-border pb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-theme-main">2. Warehouse & Fulfillment Dispatch Address</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main block">
                  Complete Street / Industrial Area Address *
                </label>
                <textarea
                  rows="2"
                  placeholder="Plot/Shop No, Industrial Area / GIDC, Street / Road, Landmark"
                  {...register("address", { required: "Full address is required" })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted/60 focus:outline-none focus:border-[#F59E0B] transition font-medium"
                />
                {errors.address && (
                  <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.address.message}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-main block">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Surat / Delhi / Tirupur"
                    {...register("city", { required: "City is required" })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main focus:outline-none focus:border-[#F59E0B] transition font-medium"
                  />
                  {errors.city && (
                    <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.city.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-main block">
                    State / Union Territory *
                  </label>
                  <select
                    {...register("state", { required: "State is required" })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main focus:outline-none focus:border-[#F59E0B] transition font-medium"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.state.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-main block">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 395002"
                    {...register("pincode", { 
                      required: "Pincode is required",
                      minLength: { value: 6, message: "Enter 6-digit PIN" }
                    })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main font-mono focus:outline-none focus:border-[#F59E0B] transition font-medium"
                  />
                  {errors.pincode && (
                    <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.pincode.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Bank & Payout Information */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-[#F59E0B] font-bold text-sm border-b border-theme-border pb-3">
              <CreditCard className="w-4 h-4" />
              <span className="text-theme-main">3. Settlement Bank Account Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main block">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  placeholder="Current or Savings Account No."
                  {...register("bankAccount", { required: "Bank account is required" })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main font-mono focus:outline-none focus:border-[#F59E0B] transition font-medium"
                />
                {errors.bankAccount && (
                  <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.bankAccount.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main block">
                  Bank IFSC Code *
                </label>
                <input
                  type="text"
                  maxLength={11}
                  placeholder="e.g. HDFC0001234"
                  {...register("ifscCode", { required: "IFSC code is required" })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main font-mono uppercase focus:outline-none focus:border-[#F59E0B] transition font-semibold"
                />
                {errors.ifscCode && (
                  <p className="text-rose-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.ifscCode.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-theme-main flex items-center justify-between">
                  <span>Merchant UPI ID</span>
                  <span className="text-[10px] text-theme-muted font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. storename@okaxis"
                  {...register("upiId")}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-theme-input border border-theme-border rounded-xl text-theme-main focus:outline-none focus:border-[#F59E0B] transition font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submission Card & Guarantee */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-xs text-theme-muted">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>
                All business records and GST credentials are encrypted under 256-bit SSL and reviewed exclusively by RealBell BizMart compliance administrators.
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span>{isSubmitting ? "Submitting Application..." : "Submit for Approval"}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        </form>

      </main>

      <Footer />
      <CartModal />
    </div>
  );
};
