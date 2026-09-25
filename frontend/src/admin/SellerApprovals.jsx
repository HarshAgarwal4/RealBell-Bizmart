import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  Store, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Eye, 
  CheckCircle, 
  FileText, 
  Landmark, 
  ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SellerApprovals = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [search, setSearch] = useState('');

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/sellers');
      if (res.status === 200 && res.data.status === 1) {
        setSellers(res.data.sellers || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load seller applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId) => {
    try {
      setProcessing(true);
      const res = await axios.post('/admin/sellers/approve', { 
        userId: sellerId,
        sellerId 
      });
      if (res.status === 200 && res.data.status === 1) {
        toast.success(res.data.msg || "Seller approved! Merchant dashboard enabled.");
        if (inspectModalOpen) setInspectModalOpen(false);
        fetchSellers();
      } else {
        toast.error(res.data?.msg || "Failed to approve seller");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error approving seller");
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenRejectModal = (seller) => {
    setSelectedSeller(seller);
    setRejectionReason('Incomplete business documentation or invalid GST number provided.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!selectedSeller) return;
    try {
      setProcessing(true);
      const res = await axios.post('/admin/sellers/reject', {
        userId: selectedSeller._id,
        sellerId: selectedSeller._id,
        reason: rejectionReason,
        rejectionReason
      });
      if (res.status === 200 && res.data.status === 1) {
        toast.info(res.data.msg || "Seller application declined with feedback sent.");
        setRejectModalOpen(false);
        if (inspectModalOpen) setInspectModalOpen(false);
        setSelectedSeller(null);
        fetchSellers();
      } else {
        toast.error(res.data?.msg || "Failed to reject seller");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting seller");
    } finally {
      setProcessing(false);
    }
  };

  const filteredSellers = sellers.filter(s => {
    const matchesFilter = filter === 'all' || s.sellerStatus === filter;
    const shop = s.sellerDetails?.shopName?.toLowerCase() || '';
    const name = s.name?.toLowerCase() || '';
    const email = s.email?.toLowerCase() || '';
    const gst = s.sellerDetails?.gstNumber?.toLowerCase() || '';
    const city = s.sellerDetails?.city?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchesSearch = shop.includes(q) || name.includes(q) || email.includes(q) || gst.includes(q) || city.includes(q);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = sellers.filter(s => s.sellerStatus === 'pending').length;
  const approvedCount = sellers.filter(s => s.sellerStatus === 'approved').length;
  const rejectedCount = sellers.filter(s => s.sellerStatus === 'rejected').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* ===================== HEADER ===================== */}
        <div className="bg-theme-card p-6 sm:p-7 rounded-3xl border border-theme-border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-theme-main">Merchant Applications & Verification</h1>
              {pendingCount > 0 && (
                <span className="bg-[#F59E0B] text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full animate-pulse shadow-2xs">
                  {pendingCount} Pending Review
                </span>
              )}
            </div>
            <p className="text-xs text-theme-muted">
              Audit supplier business credentials, GST compliance, banking details, and approve wholesale merchant accounts.
            </p>
          </div>

          <button
            onClick={fetchSellers}
            disabled={loading}
            className="p-2.5 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border text-amber-600 dark:text-amber-400 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
            title="Refresh Applications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ===================== FILTER TABS & SEARCH ===================== */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-2xs'
                  : 'bg-theme-card text-theme-muted border border-theme-border hover:text-theme-main hover:bg-[#F59E0B]/10'
              }`}
            >
              All Applications ({sellers.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filter === 'pending'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-2xs'
                  : 'bg-theme-card text-theme-muted border border-theme-border hover:text-theme-main hover:bg-[#F59E0B]/10'
              }`}
            >
              <span>Pending Review</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                filter === 'pending' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                {pendingCount}
              </span>
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                filter === 'approved'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-2xs'
                  : 'bg-theme-card text-theme-muted border border-theme-border hover:text-theme-main hover:bg-[#F59E0B]/10'
              }`}
            >
              Verified Wholesalers ({approvedCount})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                filter === 'rejected'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-2xs'
                  : 'bg-theme-card text-theme-muted border border-theme-border hover:text-theme-main hover:bg-[#F59E0B]/10'
              }`}
            >
              Declined ({rejectedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-theme-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by shop, owner, GST, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted/60 focus:outline-hidden focus:border-[#F59E0B] transition"
            />
          </div>

        </div>

        {/* ===================== SELLERS APPLICATION CARDS ===================== */}
        {loading ? (
          <div className="text-center py-20 bg-theme-card rounded-3xl border border-theme-border">
            <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-theme-muted">Loading merchant records...</p>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="bg-theme-card rounded-3xl border border-theme-border p-12 text-center space-y-3">
            <Store className="w-12 h-12 text-theme-muted/50 mx-auto" />
            <h3 className="font-bold text-base text-theme-main">No Merchant Applications Found</h3>
            <p className="text-xs text-theme-muted max-w-sm mx-auto">
              No seller registration requests matched your filter criteria or search query.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSellers.map(seller => (
              <div
                key={seller._id}
                className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/40 rounded-3xl p-5 sm:p-6 shadow-xs transition space-y-5"
              >
                {/* Top strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-theme-border text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F59E0B]/10 text-amber-600 dark:text-amber-400 border border-[#F59E0B]/20 flex items-center justify-center font-bold text-base shrink-0">
                      {seller.sellerDetails?.shopName ? seller.sellerDetails.shopName[0].toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-theme-main">
                          {seller.sellerDetails?.shopName || 'Registered Wholesale Entity'}
                        </h3>
                        <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-[#F59E0B]/10 px-2 py-0.5 rounded-md">
                          {seller.sellerDetails?.businessCategory || 'B2B Trade'}
                        </span>
                      </div>
                      <p className="text-theme-muted text-xs mt-0.5">
                        Applicant: <strong className="text-theme-main">{seller.name}</strong> • Account ID: <span className="font-mono text-theme-muted">{seller._id.slice(-6)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      seller.sellerStatus === 'approved' 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : seller.sellerStatus === 'pending'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    }`}>
                      {seller.sellerStatus === 'approved' ? 'Verified Wholesaler' : seller.sellerStatus}
                    </span>
                  </div>
                </div>

                {/* 3-Column Dossier Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Column 1: Contact & Communication */}
                  <div className="space-y-2 bg-theme-page p-4 rounded-2xl border border-theme-border">
                    <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] block">
                      Primary Contact
                    </span>
                    <p className="text-theme-main font-semibold flex items-center gap-1.5">
                      <span>{seller.name}</span>
                    </p>
                    <p className="text-theme-muted flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                      <span className="truncate">{seller.email}</span>
                    </p>
                    <p className="text-theme-muted flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                      <span>{seller.sellerDetails?.phone || seller.phone || 'N/A'}</span>
                    </p>
                  </div>

                  {/* Column 2: Legal Entity & Location */}
                  <div className="space-y-2 bg-theme-page p-4 rounded-2xl border border-theme-border">
                    <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] block">
                      Tax & Business Location
                    </span>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-mono text-theme-main font-bold">
                        {seller.sellerDetails?.gstNumber || 'Not Provided'}
                      </span>
                    </div>
                    <p className="text-theme-muted flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {seller.sellerDetails?.address || 'Registered Office'}, {seller.sellerDetails?.city || ''} {seller.sellerDetails?.state || ''} {seller.sellerDetails?.pincode ? `- ${seller.sellerDetails.pincode}` : ''}
                      </span>
                    </p>
                  </div>

                  {/* Column 3: Payout Banking Coordinates */}
                  <div className="space-y-2 bg-theme-page p-4 rounded-2xl border border-theme-border">
                    <span className="font-bold text-theme-muted uppercase tracking-wider text-[10px] block">
                      Settlement Account
                    </span>
                    <div className="flex items-center gap-2 text-theme-main">
                      <Landmark className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                      <span className="font-mono">
                        {seller.sellerDetails?.bankAccount 
                          ? `•••• •••• ${seller.sellerDetails.bankAccount.slice(-4)}`
                          : 'Bank Info Pending'}
                      </span>
                    </div>
                    <p className="text-theme-muted flex items-center gap-2">
                      <span className="font-bold text-[10px] text-theme-muted">IFSC:</span>
                      <span className="font-mono font-semibold text-theme-main">{seller.sellerDetails?.ifscCode || 'N/A'}</span>
                    </p>
                    {seller.sellerDetails?.upiId && (
                      <p className="text-theme-muted flex items-center gap-2">
                        <span className="font-bold text-[10px] text-theme-muted">UPI:</span>
                        <span className="font-mono text-theme-main">{seller.sellerDetails.upiId}</span>
                      </p>
                    )}
                  </div>

                </div>

                {/* Rejection Note Alert if previously rejected */}
                {seller.sellerStatus === 'rejected' && seller.sellerDetails?.rejectionReason && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-rose-500">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Prior Rejection Reason:</span> {seller.sellerDetails.rejectionReason}
                    </div>
                  </div>
                )}

                {/* Action Controls Footer */}
                <div className="pt-3 border-t border-theme-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      setSelectedSeller(seller);
                      setInspectModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-theme-muted hover:text-theme-main font-semibold transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#F59E0B]" />
                    <span>Inspect Full Dossier</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {seller.sellerStatus === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleOpenRejectModal(seller)}
                          disabled={processing}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 font-bold transition cursor-pointer disabled:opacity-50"
                        >
                          Decline Application
                        </button>
                        <button
                          onClick={() => handleApprove(seller._id)}
                          disabled={processing}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition cursor-pointer shadow-2xs disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Merchant</span>
                        </button>
                      </>
                    ) : seller.sellerStatus === 'approved' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Active Supplier in Marketplace</span>
                        </span>
                        <button
                          onClick={() => handleOpenRejectModal(seller)}
                          className="text-xs text-theme-muted hover:text-rose-500 transition cursor-pointer ml-2"
                        >
                          Revoke Approval
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApprove(seller._id)}
                        disabled={processing}
                        className="px-4 py-1.5 rounded-xl bg-theme-page hover:bg-emerald-500 hover:text-slate-950 text-theme-main font-bold border border-theme-border transition cursor-pointer"
                      >
                        Re-Approve Merchant
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ===================== INSPECT DOSSIER MODAL ===================== */}
        <AnimatePresence>
          {inspectModalOpen && selectedSeller && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-poppins">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-theme-card border border-theme-border rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                  <div className="flex items-center gap-2.5">
                    <Store className="w-5 h-5 text-[#F59E0B]" />
                    <div>
                      <h3 className="font-bold text-base text-theme-main">
                        {selectedSeller.sellerDetails?.shopName || 'Merchant Dossier'}
                      </h3>
                      <p className="text-[11px] text-theme-muted">Full Business Compliance Record</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectModalOpen(false)}
                    className="p-1 rounded-lg text-theme-muted hover:text-theme-main"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-theme-page p-3.5 rounded-2xl border border-theme-border">
                    <div>
                      <span className="text-[10px] text-theme-muted font-bold block">LEGAL BUSINESS NAME</span>
                      <p className="text-theme-main font-semibold">{selectedSeller.sellerDetails?.shopName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-theme-muted font-bold block">CATEGORY</span>
                      <p className="text-amber-600 dark:text-amber-400 font-semibold capitalize">{selectedSeller.sellerDetails?.businessCategory || 'B2B'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-theme-muted font-bold block">GSTIN COMPLIANCE</span>
                      <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{selectedSeller.sellerDetails?.gstNumber || 'Not Submitted'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-theme-muted font-bold block">REGISTERED APPLICANT</span>
                      <p className="text-theme-main">{selectedSeller.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-theme-page p-3.5 rounded-2xl border border-theme-border">
                    <span className="text-[10px] text-theme-muted font-bold block">REGISTERED ADDRESS</span>
                    <p className="text-theme-main">
                      {selectedSeller.sellerDetails?.address || 'No street address specified.'}
                    </p>
                    <p className="text-theme-muted font-medium">
                      {selectedSeller.sellerDetails?.city || ''}, {selectedSeller.sellerDetails?.state || ''} - {selectedSeller.sellerDetails?.pincode || ''}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-theme-page p-3.5 rounded-2xl border border-theme-border">
                    <div>
                      <span className="text-[10px] text-theme-muted font-bold block">BANK ACCOUNT</span>
                      <p className="font-mono text-theme-main font-semibold">{selectedSeller.sellerDetails?.bankAccount || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-theme-muted font-bold block">IFSC CODE</span>
                      <p className="font-mono text-theme-main font-semibold">{selectedSeller.sellerDetails?.ifscCode || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-theme-muted font-bold block">UPI ID</span>
                      <p className="font-mono text-theme-main truncate">{selectedSeller.sellerDetails?.upiId || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-theme-border flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setInspectModalOpen(false);
                      handleOpenRejectModal(selectedSeller);
                    }}
                    className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 font-bold text-xs"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleApprove(selectedSeller._id)}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-2xs"
                  >
                    Confirm & Approve Merchant
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ===================== REJECTION REASON MODAL ===================== */}
        <AnimatePresence>
          {rejectModalOpen && selectedSeller && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-poppins">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-theme-card border border-theme-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                  <div className="flex items-center gap-2 text-rose-500">
                    <XCircle className="w-5 h-5" />
                    <h3 className="font-bold text-base text-theme-main">Decline Application</h3>
                  </div>
                  <button
                    onClick={() => setRejectModalOpen(false)}
                    className="p-1 rounded-lg text-theme-muted hover:text-theme-main"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-theme-muted">
                  Select a standardized compliance reason or provide custom feedback to notify <strong className="text-theme-main">{selectedSeller.name}</strong>.
                </p>

                {/* Preset quick reasons */}
                <div className="space-y-1.5">
                  {[
                    "Invalid or unverified GSTIN number provided.",
                    "Bank account holder name does not match business documents.",
                    "Incomplete warehouse address and delivery pincode details.",
                    "Selected category not currently accepted on the B2B catalog."
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition border cursor-pointer ${
                        rejectionReason === preset
                          ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold'
                          : 'border-theme-border text-theme-muted hover:bg-theme-page hover:text-theme-main'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] text-theme-muted uppercase font-bold block mb-1">
                    Custom Feedback to Applicant
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-3 bg-theme-input border border-theme-border rounded-xl text-xs text-theme-main focus:outline-hidden focus:border-rose-500"
                    placeholder="Enter reason for rejection..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-main"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReject}
                    disabled={processing}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-2xs disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};
