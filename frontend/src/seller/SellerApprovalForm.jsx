import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { toast } from 'react-toastify';
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
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SellerApprovalForm = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const fetchUser = useStore(state => state.fetchUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      shopName: user?.sellerDetails?.shopName || '',
      gstNumber: user?.sellerDetails?.gstNumber || '',
      businessCategory: user?.sellerDetails?.businessCategory || 'apparel',
      phone: user?.sellerDetails?.phone || user?.phone || '',
      address: user?.sellerDetails?.address || '',
      city: user?.sellerDetails?.city || '',
      state: user?.sellerDetails?.state || '',
      pincode: user?.sellerDetails?.pincode || '',
      bankAccount: user?.sellerDetails?.bankAccount || '',
      ifscCode: user?.sellerDetails?.ifscCode || '',
      upiId: user?.sellerDetails?.upiId || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/seller/apply', data);
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Application submitted successfully for Admin review!");
        await fetchUser();
        navigate('/seller/dashboard');
      } else {
        toast.error(res.data.msg || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting seller application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-poppins py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/30"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seller Onboarding Portal</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Store className="w-8 h-8 text-amber-500" />
              <span>Shopkeeper & Seller Registration</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Complete your business verification form. Once submitted, our Admin team will review your shop details and approve your seller dashboard within 24 hours.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Business Details */}
          <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4" />
              <span>1. Shop & Business Identification</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Wholesale Enterprises"
                  {...register("shopName", { required: "Shop name is required" })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                />
                {errors.shopName && (
                  <p className="text-rose-400 text-xs mt-1">{errors.shopName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Category *
                </label>
                <select
                  {...register("businessCategory", { required: "Category is required" })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                >
                  <option value="apparel">Apparel & Garments</option>
                  <option value="uniforms">Corporate Uniforms</option>
                  <option value="bags">Bags & Luggage</option>
                  <option value="stationery">Stationery & Corporate Gifts</option>
                  <option value="drinkware">Drinkware & Bottles</option>
                  <option value="footwear">Footwear & Safety</option>
                  <option value="home">Home & Living</option>
                  <option value="packaging">Packaging & Boxes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GST Number (GSTIN) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  {...register("gstNumber", { required: "GST number is required for verified seller status" })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white uppercase focus:outline-hidden focus:border-amber-500 font-mono"
                />
                {errors.gstNumber && (
                  <p className="text-rose-400 text-xs mt-1">{errors.gstNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                />
                {errors.phone && (
                  <p className="text-rose-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Address & Warehouse Location */}
          <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4" />
              <span>2. Shop / Warehouse Location</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Complete Address *
                </label>
                <textarea
                  rows="2"
                  placeholder="Plot/Shop No, Industrial Area, Road, Landmark"
                  {...register("address", { required: "Address is required" })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                />
                {errors.address && (
                  <p className="text-rose-400 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Surat / Delhi / Tirupur"
                    {...register("city", { required: "City is required" })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                  />
                  {errors.city && (
                    <p className="text-rose-400 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat / Maharashtra"
                    {...register("state", { required: "State is required" })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                  />
                  {errors.state && (
                    <p className="text-rose-400 text-xs mt-1">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 395002"
                    {...register("pincode", { required: "Pincode is required" })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                  />
                  {errors.pincode && (
                    <p className="text-rose-400 text-xs mt-1">{errors.pincode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payout & Bank Information */}
          <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-3">
              <CreditCard className="w-4 h-4" />
              <span>3. Settlement Bank Account Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  placeholder="Enter current / savings account"
                  {...register("bankAccount", { required: "Bank account is required" })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-hidden focus:border-amber-500"
                />
                {errors.bankAccount && (
                  <p className="text-rose-400 text-xs mt-1">{errors.bankAccount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  {...register("ifscCode", { required: "IFSC code is required" })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white font-mono uppercase focus:outline-hidden focus:border-amber-500"
                />
                {errors.ifscCode && (
                  <p className="text-rose-400 text-xs mt-1">{errors.ifscCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business UPI ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. shopname@okaxis"
                  {...register("upiId")}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Your business documents are encrypted and reviewed solely by RealBell Admin.</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm transition shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Submitting Application..." : "Submit for Admin Approval"}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};
