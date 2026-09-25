import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  PhoneCall, 
  Mail, 
  Clock, 
  FileText, 
  ShoppingBag, 
  ExternalLink,
  Award,
  ChevronRight,
  Headphones,
  CheckCircle2
} from 'lucide-react';

export const MerchantFooter = () => {
  return (
    <footer className="w-full bg-theme-card border-t border-theme-border mt-16 font-poppins text-theme-main transition-colors duration-200">
      
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-theme-border bg-theme-page/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#F59E0B] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">B2B Freight Network</h4>
                <p className="text-[11px] text-theme-muted mt-0.5 leading-relaxed">
                  Integrated surface cargo & express courier with automated waybills.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">Guaranteed Payouts</h4>
                <p className="text-[11px] text-theme-muted mt-0.5 leading-relaxed">
                  Razorpay Escrow settlements with automated T+1 merchant disbursement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">GST Compliance</h4>
                <p className="text-[11px] text-theme-muted mt-0.5 leading-relaxed">
                  Automated tax invoice generation with Input Tax Credit (ITC) reconciliation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-theme-main">Dedicated Desk</h4>
                <p className="text-[11px] text-theme-muted mt-0.5 leading-relaxed">
                  Priority resolution manager with direct 24/7 seller helpline access.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/seller/dashboard" className="flex items-center gap-2">
              <img src="/logo.png" alt="RealBell" className="h-8 w-auto bg-white/10 p-0.5 rounded-lg" />
              <div className="flex items-center">
                <span className="font-bold text-lg text-theme-main">RealBell</span>
                <span className="font-bold text-lg text-[#F59E0B]">BizMart</span>
              </div>
              <span className="ml-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                Merchant Center
              </span>
            </Link>

            <p className="text-xs text-theme-muted leading-relaxed max-w-sm">
              Empowering India's verified manufacturers, wholesalers, and distributor brands with direct commercial access to corporate enterprises, retail stores, and institutional buyers nationwide.
            </p>

            {/* Direct Switch to Buyer Marketplace Banner */}
            <div className="p-3.5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 max-w-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B]">
                <ShoppingBag className="w-4 h-4" />
                <span>Buyer Marketplace</span>
              </div>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                Want to browse the public marketplace as a buyer?
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-[#F59E0B] hover:bg-[#D97706] px-3.5 py-1.5 rounded-xl transition"
              >
                <span>Open Marketplace</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Col 1: Merchant Tools */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-theme-main">
              Merchant Operations
            </h5>
            <ul className="space-y-2 text-xs text-theme-muted">
              <li><Link to="/seller/dashboard" className="hover:text-[#F59E0B] transition">Overview Analytics</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-[#F59E0B] transition">Wholesale Inventory</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-[#F59E0B] transition">Inflow Commercial Orders</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-[#F59E0B] transition">Store & GST Details</Link></li>
              <li><Link to="/" className="hover:text-[#F59E0B] transition flex items-center gap-1">
                <span>Buyer Storefront</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link></li>
            </ul>
          </div>

          {/* Col 2: Logistics & Settlements */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-theme-main">
              Settlement & Logistics
            </h5>
            <ul className="space-y-2 text-xs text-theme-muted">
              <li className="hover:text-[#F59E0B] transition cursor-pointer">Razorpay Merchant Escrow</li>
              <li className="hover:text-[#F59E0B] transition cursor-pointer">T+1 Bank Settlements</li>
              <li className="hover:text-[#F59E0B] transition cursor-pointer">Delhivery Surface Cargo</li>
              <li className="hover:text-[#F59E0B] transition cursor-pointer">BlueDart Express Air</li>
              <li className="hover:text-[#F59E0B] transition cursor-pointer">Packaging & Carton Guidelines</li>
            </ul>
          </div>

          {/* Col 3: Support & Compliance */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-theme-main">
              Partner Help & Support
            </h5>
            <div className="space-y-2.5 text-xs text-theme-muted">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                <span>1800-890-REAL (7325)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                <span>sellers@realbell.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Desk: Mon-Sat, 9AM-8PM</span>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Verified Wholesaler Network
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Legal Bar */}
      <div className="border-t border-theme-border py-4 bg-theme-page/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-theme-muted">
          <div>
            © {new Date().getFullYear()} RealBell BizMart Technologies Pvt. Ltd. All Merchant Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-theme-main cursor-pointer">Merchant Code of Conduct</span>
            <span>•</span>
            <span className="hover:text-theme-main cursor-pointer">Wholesale Escrow Terms</span>
            <span>•</span>
            <span className="hover:text-theme-main cursor-pointer">GST Policy</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
