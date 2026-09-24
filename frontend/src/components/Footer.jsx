import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Globe, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ onOpenRFQ }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 font-poppins">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Direct Wholesale Rates</h4>
                <p className="text-[11px] text-slate-400">Save 25-40% over local traders</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">100% Verified Sellers</h4>
                <p className="text-[11px] text-slate-400">Business registration & audit verified</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Escrow Protection</h4>
                <p className="text-[11px] text-slate-400">Funds released after QC approval</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Doorstep Delivery</h4>
                <p className="text-[11px] text-slate-400">Pan-India & global freight</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="RealBell BizMart" 
                className="h-10 w-auto bg-white p-1 rounded-lg"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-white">RealBell</span>
                <span className="text-2xl font-bold text-amber-500">BizMart</span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              RealBell BizMart is a premier B2B online marketplace connecting verified wholesalers, distributors, brand owners, and business buyers across India and worldwide.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sector 62, Industrial Area, Electronic City, Noida, UP, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 (120) 489-2000 / 1800-890-REAL</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>sourcing@realbellbizmart.com</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Compliance:</span>
              <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full text-[10px] text-amber-300 font-bold">
                ISO 9001:2015
              </span>
              <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-300 font-bold">
                Make In India
              </span>
              <span className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full text-[10px] text-blue-300 font-bold">
                MSME Registered
              </span>
            </div>
          </div>

          {/* Sourcing Categories */}
          <div>
            <h4 className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5">
              Top Sourcing
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Custom T-Shirts & Polos</a></li>
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Corporate & School Uniforms</a></li>
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Backpacks & Laptop Bags</a></li>
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Corporate Gifts & Welcome Kits</a></li>
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Insulated Bottles & Tumblers</a></li>
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Industrial Safety Shoes & PPE</a></li>
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Hospital Scrubs & Lab Coats</a></li>
              <li><a href="#product-catalog" className="hover:text-amber-400 transition">Hotel Linens & Bedding</a></li>
            </ul>
          </div>

          {/* Buyer Services */}
          <div>
            <h4 className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5">
              Buyer Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => onOpenRFQ && onOpenRFQ({ title: 'Bulk Buyer RFQ' })}
                  className="hover:text-amber-400 transition text-left cursor-pointer"
                >
                  Post Buying Requirement
                </button>
              </li>
              <li><a href="#why-choose" className="hover:text-amber-400 transition">RealBell Trade Assurance</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-400 transition">Quality Inspection & QC</a></li>
              <li><a href="#why-choose" className="hover:text-amber-400 transition">Custom OEM Prototyping</a></li>
              <li><a href="#why-choose" className="hover:text-amber-400 transition">Export Logistics & Customs</a></li>
              <li><Link to="/login" className="hover:text-amber-400 transition">Buyer Portal Login</Link></li>
            </ul>
          </div>

          {/* Suppliers & Enterprise */}
          <div>
            <h4 className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5">
              Wholesalers & Sellers
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/signup?role=seller" className="hover:text-amber-400 transition font-semibold text-amber-400">Register as a Shopkeeper / Seller</Link></li>
              <li><Link to="/login" className="hover:text-amber-400 transition">Supplier Central Login</Link></li>
              <li><a href="#why-choose" className="hover:text-amber-400 transition">Seller Verification & Trust</a></li>
              <li><a href="#why-choose" className="hover:text-amber-400 transition">Global Export Inquiries</a></li>
              <li><a href="#why-choose" className="hover:text-amber-400 transition">Domestic Wholesale RFQs</a></li>
              <li><a href="#why-choose" className="hover:text-amber-400 transition">Seller Protection Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Newsletter & RFQ Quick Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base">Stay updated on exclusive wholesale deals</h4>
            <p className="text-xs text-slate-400 mt-1">Get monthly price indices, marketplace insights, and seasonal bulk discounts.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter corporate email address"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs px-5 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer shadow-xs"
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="bg-black/60 border-t border-slate-900 py-5 sm:py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
          <p>© 2026 RealBell BizMart Pvt. Ltd. All rights reserved. India's Premier Online B2B Marketplace.</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <a href="#terms" className="hover:text-slate-300 transition">Terms of Service</a>
            <a href="#privacy" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#escrow" className="hover:text-slate-300 transition">Escrow Agreement</a>
            <a href="#security" className="hover:text-slate-300 transition">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
