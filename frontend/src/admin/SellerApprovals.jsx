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
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SellerApprovals = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [search, setSearch] = useState('');

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
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
      const res = await axios.post('/admin/sellers/approve', { sellerId });
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Seller successfully approved! Dashboard unlocked for seller.");
        fetchSellers();
      } else {
        toast.error("Failed to approve seller");
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
        sellerId: selectedSeller._id,
        rejectionReason
      });
      if (res.status === 200 && res.data.status === 1) {
        toast.info("Seller application rejected with feedback sent");
        setRejectModalOpen(false);
        setSelectedSeller(null);
        fetchSellers();
      } else {
        toast.error("Failed to reject seller");
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
    const q = search.toLowerCase();
    const matchesSearch = shop.includes(q) || name.includes(q) || email.includes(q) || gst.includes(q);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = sellers.filter(s => s.sellerStatus === 'pending').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Seller Applications & Verification</h1>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full animate-pulse">
                  {pendingCount} Pending Review
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Review shopkeeper details, GSTIN compliance, and approve wholesale merchant accounts
            </p>
          </div>

          <button
            onClick={fetchSellers}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by shop name, owner, GST..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl capitalize font-semibold transition whitespace-nowrap ${
                  filter === status
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {status} ({sellers.filter(s => status === 'all' ? true : s.sellerStatus === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Sellers Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading seller applications...</p>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="bg-slate-950/60 rounded-3xl border border-slate-800 p-12 text-center space-y-3">
            <Store className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-300">No Applications in this View</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no seller accounts matching the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSellers.map(seller => (
              <div
                key={seller._id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl transition space-y-5"
              >
                {/* Top strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-850 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {seller.sellerDetails?.shopName || 'Registered Seller'}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        Category: <span className="capitalize text-amber-400 font-semibold">{seller.sellerDetails?.businessCategory || 'General'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      seller.sellerStatus === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : seller.sellerStatus === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {seller.sellerStatus}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* Column 1: Contact & Owner */}
                  <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Merchant Contact
                    </span>
                    <p className="text-white font-semibold">{seller.name}</p>
                    <p className="text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{seller.email}</span>
                    </p>
                    <p className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{seller.sellerDetails?.phone || seller.phone || 'N/A'}</span>
                    </p>
                  </div>

                  {/* Column 2: Location & GST */}
                  <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Shop Address & GST
                    </span>
                    <p className="text-amber-400 font-mono font-semibold">
                      GSTIN: {seller.sellerDetails?.gstNumber || 'Not provided'}
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      {seller.sellerDetails?.address ? (
                        `${seller.sellerDetails.address}, ${seller.sellerDetails.city}, ${seller.sellerDetails.state} - ${seller.sellerDetails.pincode}`
                      ) : (
                        'No address provided'
                      )}
                    </p>
                  </div>

                  {/* Column 3: Payout Details */}
                  <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Settlement Banking
                    </span>
                    <p className="text-slate-300">
                      Bank A/C: <span className="font-mono font-semibold text-white">{seller.sellerDetails?.bankAccount || 'N/A'}</span>
                    </p>
                    <p className="text-slate-300">
                      IFSC: <span className="font-mono font-semibold text-white">{seller.sellerDetails?.ifscCode || 'N/A'}</span>
                    </p>
                    {seller.sellerDetails?.upiId && (
                      <p className="text-slate-400">
                        UPI: <span className="text-slate-200">{seller.sellerDetails.upiId}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Show rejection reason if rejected */}
                {seller.sellerStatus === 'rejected' && seller.sellerDetails?.rejectionReason && (
                  <div className="bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-xl text-xs text-rose-300">
                    <strong>Rejection Reason:</strong> {seller.sellerDetails.rejectionReason}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {seller.sellerStatus !== 'approved' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(seller._id)}
                      disabled={processing}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Seller</span>
                    </motion.button>
                  )}

                  {seller.sellerStatus !== 'rejected' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpenRejectModal(seller)}
                      disabled={processing}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </motion.button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Reason Modal */}
        <AnimatePresence>
          {rejectModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRejectModalOpen(false)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Reject Seller Application</span>
                  </div>
                  <button
                    onClick={() => setRejectModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
                  <p className="text-slate-400">
                    Specify the reason why <strong>{selectedSeller?.sellerDetails?.shopName || selectedSeller?.name}</strong> is being rejected. This feedback will be displayed to the applicant.
                  </p>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-300">
                      Feedback / Rejection Reason *
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setRejectModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                    >
                      {processing ? "Rejecting..." : "Confirm Rejection"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};
