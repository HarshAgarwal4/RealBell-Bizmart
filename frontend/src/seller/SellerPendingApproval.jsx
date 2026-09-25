import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartModal } from '../user/CartModal';
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
  FileText,
  ChevronRight,
  ShieldCheck,
  Sparkles
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
    }, 600);
  };

  return (
    <div className="min-h-screen bg-theme-page text-theme-main font-poppins flex flex-col selection:bg-[#F59E0B] selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-theme-muted">
            <Link to="/" className="hover:text-[#F59E0B] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/user/dashboard" className="hover:text-[#F59E0B] transition">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-theme-main font-semibold">Approval Status</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshStatus}
              disabled={checking}
              className="inline-flex items-center gap-1.5 text-xs text-theme-main hover:text-[#F59E0B] font-semibold bg-theme-card px-3 py-1.5 rounded-xl border border-theme-border cursor-pointer disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F59E0B] ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Checking...' : 'Check Live Status'}</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-main transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Main Status Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-6"
        >
          {isPending ? (
            /* Pending Approval View */
            <div className="space-y-6">
              
              {/* Icon badge */}
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Application Under Review</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-theme-main tracking-tight">
                  Merchant Verification in Progress
                </h1>
                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                  Thank you for submitting your merchant registration for <strong className="text-theme-main">{user?.sellerDetails?.shopName || 'your business'}</strong>. Our compliance team is verifying your GST credentials and warehouse details.
                </p>
              </div>

              {/* Visual Approval Steps Timeline */}
              <div className="max-w-xl mx-auto py-2">
                <div className="grid grid-cols-3 gap-2 text-left relative">
                  
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Step 1</span>
                    </div>
                    <div className="text-[11px] font-semibold text-theme-main">Submitted</div>
                    <div className="text-[10px] text-theme-muted">Application filed</div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1 ring-2 ring-[#F59E0B]/20">
                    <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold text-xs">
                      <Clock className="w-4 h-4 shrink-0 animate-spin" />
                      <span>Step 2</span>
                    </div>
                    <div className="text-[11px] font-semibold text-theme-main">Reviewing</div>
                    <div className="text-[10px] text-theme-muted">Admin verification</div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-2xl bg-theme-subtle border border-theme-border opacity-60 space-y-1">
                    <div className="flex items-center gap-1.5 text-theme-muted font-bold text-xs">
                      <Store className="w-4 h-4 shrink-0" />
                      <span>Step 3</span>
                    </div>
                    <div className="text-[11px] font-semibold text-theme-main">Active Store</div>
                    <div className="text-[10px] text-theme-muted">Dashboard unlock</div>
                  </div>

                </div>
              </div>

              {/* Application Summary Box */}
              <div className="bg-theme-page border border-theme-border rounded-2xl p-5 text-left max-w-xl mx-auto space-y-3">
                <div className="text-xs font-bold text-theme-main uppercase tracking-wider pb-2 border-b border-theme-border">
                  Application Summary
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-theme-muted block text-[11px]">Shop / Business Name</span>
                    <span className="font-semibold text-theme-main">{user?.sellerDetails?.shopName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted block text-[11px]">GSTIN</span>
                    <span className="font-semibold text-theme-main font-mono">{user?.sellerDetails?.gstNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted block text-[11px]">Category</span>
                    <span className="font-semibold text-theme-main capitalize">{user?.sellerDetails?.businessCategory || 'Wholesale'}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted block text-[11px]">Submission Date</span>
                    <span className="font-semibold text-theme-main">
                      {user?.sellerDetails?.appliedAt ? new Date(user.sellerDetails.appliedAt).toLocaleDateString('en-IN') : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-theme-muted space-y-1 max-w-md mx-auto">
                <p>Standard turnaround time: <strong>2 to 24 business hours</strong>.</p>
                <p>Once verified, your merchant portal and wholesale inventory manager will unlock automatically.</p>
              </div>

            </div>
          ) : isRejected ? (
            /* Rejected View */
            <div className="space-y-6">
              
              <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Action Required</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-theme-main tracking-tight">
                  Application Requires Revision
                </h1>
                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                  Your seller registration was not approved during initial review. Please check the compliance feedback below and update your details to re-apply.
                </p>
              </div>

              {/* Admin Feedback Box */}
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-5 text-left max-w-xl mx-auto space-y-2">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Compliance Officer Feedback</span>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-medium">
                  "{user?.sellerDetails?.rejectionReason || 'Invalid GST number or incomplete warehouse address provided. Please update and re-submit.'}"
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onReapply}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Update & Re-apply as Merchant</span>
                </button>
              </div>

            </div>
          ) : null}

          {/* Support Helpline Footer */}
          <div className="pt-6 border-t border-theme-border text-xs text-theme-muted flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Merchant Onboarding Support: <strong>1800-890-REAL</strong></span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>sellers@realbell.in</span>
            </span>
          </div>

        </motion.div>

      </main>

      <Footer />
      <CartModal />
    </div>
  );
};
