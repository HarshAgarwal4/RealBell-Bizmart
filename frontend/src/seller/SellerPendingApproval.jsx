import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';
import { 
  Clock, 
  AlertCircle, 
  Store, 
  ShieldAlert, 
  RefreshCw, 
  ArrowLeft, 
  PhoneCall, 
  Mail, 
  CheckCircle2,
  Building2,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SellerPendingApproval = ({ onReapply }) => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const fetchUser = useStore(state => state.fetchUser);
  const [checking, setChecking] = React.useState(false);

  const isPending = user?.sellerStatus === 'pending';
  const isRejected = user?.sellerStatus === 'rejected';

  const handleRefreshStatus = async () => {
    setChecking(true);
    await fetchUser();
    setTimeout(() => {
      setChecking(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-poppins py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/30"></div>

      <div className="relative z-10 max-w-2xl w-full mx-auto space-y-6">
        
        {/* Top bar back link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <button
            onClick={handleRefreshStatus}
            disabled={checking}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Check Approval Status</span>
          </button>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6"
        >
          {isPending ? (
            /* Pending Approval View */
            <>
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Clock className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Application Under Review
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Seller Application Pending Admin Approval
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Thank you for submitting your shop details for <span className="text-amber-400 font-semibold">{user?.sellerDetails?.shopName || 'your business'}</span>. Our platform admin is currently verifying your GST and business credentials.
                </p>
              </div>

              {/* Review Timeline Details */}
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Application Summary
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Shop Name</span>
                    <span className="font-semibold text-slate-200">{user?.sellerDetails?.shopName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">GSTIN</span>
                    <span className="font-semibold text-slate-200 font-mono">{user?.sellerDetails?.gstNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Category</span>
                    <span className="font-semibold text-slate-200 capitalize">{user?.sellerDetails?.businessCategory || 'Wholesale'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Submission Date</span>
                    <span className="font-semibold text-slate-200">
                      {user?.sellerDetails?.appliedAt ? new Date(user.sellerDetails.appliedAt).toLocaleDateString('en-IN') : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-2">
                <p>Standard turnaround time: <strong>2 to 24 business hours</strong>.</p>
                <p>Once approved, your full Seller Dashboard will unlock automatically.</p>
              </div>
            </>
          ) : isRejected ? (
            /* Rejected View */
            <>
              <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
                <ShieldAlert className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-400/10 px-3 py-1 rounded-full border border-rose-400/20">
                  Action Required
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Application Requires Revision
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Your seller registration was not approved by the RealBell Admin team. Please review the reason below and update your details to re-apply.
                </p>
              </div>

              {/* Rejection Reason box */}
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-5 text-left space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Admin Feedback / Reason</span>
                </div>
                <p className="text-xs text-rose-200 leading-relaxed font-medium">
                  "{user?.sellerDetails?.rejectionReason || 'Invalid GST number or incomplete address details provided. Please review and re-submit.'}"
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onReapply}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Update & Re-apply as Seller</span>
                </button>
              </div>
            </>
          ) : null}

          {/* Support Helpline */}
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Seller Support: 1800-890-REAL</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>sellers@realbell.in</span>
            </span>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
