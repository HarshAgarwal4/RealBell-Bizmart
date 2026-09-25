import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartModal } from './CartModal';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  FileText, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ArrowLeft, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Sparkles, 
  Camera, 
  Check, 
  Eye, 
  EyeOff,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Curated avatar presets for easy 1-click profile customisation
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
];

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

export const UserProfile = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const updateUserProfile = useStore(state => state.updateUserProfile);

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'address' | 'business' | 'security'
  const [saving, setSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile: '',
    companyName: '',
    gstin: '',
    businessType: 'Individual',
    address: {
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });

  // Password Update State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profile: user.profile && user.profile !== '/defaultProfile.png' ? user.profile : '',
        companyName: user.companyName || '',
        gstin: user.gstin || '',
        businessType: user.businessType || 'Individual',
        address: {
          addressLine: user.address?.addressLine || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || 'India'
        }
      });
    }
  }, [user]);

  // Real-time calculation of profile completion percentage & checklist
  const completionStats = React.useMemo(() => {
    let score = 0;
    const checklist = [];

    // 1. Basic Account Info (25%)
    if (formData.name && formData.name.trim().length >= 2) {
      score += 25;
      checklist.push({ id: 'basic', label: 'Full Name & Email', completed: true, tab: 'personal' });
    } else {
      checklist.push({ id: 'basic', label: 'Full Name & Email', completed: false, tab: 'personal' });
    }

    // 2. Phone Contact (20%)
    if (formData.phone && formData.phone.trim().length >= 10) {
      score += 20;
      checklist.push({ id: 'phone', label: 'Mobile Number (+91)', completed: true, tab: 'personal' });
    } else {
      checklist.push({ id: 'phone', label: 'Mobile Number (+91)', completed: false, tab: 'personal' });
    }

    // 3. Shipping / Delivery Address (30%)
    const hasAddress = Boolean(
      formData.address.addressLine.trim() &&
      formData.address.city.trim() &&
      formData.address.state.trim() &&
      formData.address.pincode.trim()
    );
    if (hasAddress) {
      score += 30;
      checklist.push({ id: 'address', label: 'Default Delivery Address', completed: true, tab: 'address' });
    } else {
      checklist.push({ id: 'address', label: 'Default Delivery Address', completed: false, tab: 'address' });
    }

    // 4. Business & Tax Details (15%)
    const hasBusiness = Boolean(formData.companyName.trim() || formData.gstin.trim());
    if (hasBusiness) {
      score += 15;
      checklist.push({ id: 'business', label: 'Business / Company Details', completed: true, tab: 'business' });
    } else {
      checklist.push({ id: 'business', label: 'Business / Company Details', completed: false, tab: 'business' });
    }

    // 5. Profile Picture (10%)
    if (formData.profile && formData.profile.trim()) {
      score += 10;
      checklist.push({ id: 'avatar', label: 'Profile Picture / Avatar', completed: true, tab: 'personal' });
    } else {
      checklist.push({ id: 'avatar', label: 'Profile Picture / Avatar', completed: false, tab: 'personal' });
    }

    return { score, checklist };
  }, [formData]);

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  // Submit Profile Changes
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Please enter a valid full name (at least 2 characters)");
      setActiveTab('personal');
      return;
    }

    if (formData.phone && formData.phone.trim().length < 10) {
      toast.warning("Please provide a valid 10-digit mobile number");
      setActiveTab('personal');
      return;
    }

    setSaving(true);
    try {
      const res = await updateUserProfile(formData);
      if (res.success) {
        // Success notification is handled inside store
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in current and new password");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await axios.post('/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.status === 1) {
        toast.success(res.data.msg || "Password updated successfully!");
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(res.data.msg || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-page text-theme-main font-poppins flex flex-col selection:bg-[#F59E0B] selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-theme-muted">
            <Link to="/" className="hover:text-[#F59E0B] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/user/dashboard" className="hover:text-[#F59E0B] transition">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-theme-main font-semibold">Account Profile</span>
          </div>

          <Link
            to="/user/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-main transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-theme-card to-theme-card border border-amber-500/25 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#F59E0B] text-slate-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3 h-3" /> Profile Status
                </span>
                <span className="text-xs text-theme-muted">
                  {completionStats.score === 100 ? '100% Completed — All Set!' : `${completionStats.score}% Completed`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-theme-main tracking-tight">
                Complete Your Profile
              </h1>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                Add your verified contact number, delivery address, and business information to enable instant 1-click checkout and automated GST wholesale invoicing.
              </p>
            </div>

            {/* Visual Progress Bar & Score Circle */}
            <div className="w-full lg:w-72 bg-theme-page/80 border border-theme-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-theme-main">Profile Strength</span>
                <span className={`font-black ${completionStats.score === 100 ? 'text-emerald-500' : 'text-[#F59E0B]'}`}>
                  {completionStats.score}%
                </span>
              </div>
              
              {/* Progress track */}
              <div className="w-full h-2.5 bg-theme-subtle rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionStats.score}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    completionStats.score === 100 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                />
              </div>

              {/* Mini Checklist Badges */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {completionStats.checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.tab)}
                    className={`flex items-center gap-1.5 text-[10px] p-1.5 rounded-lg border text-left transition cursor-pointer ${
                      item.completed 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-theme-card text-theme-muted border-theme-border hover:border-[#F59E0B]'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-[#F59E0B] shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Main Grid: Left Navigation / Profile Summary & Right Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (4 cols): User Card & Tab Navigation */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* User Info Overview Card */}
            <div className="bg-theme-card border border-theme-border rounded-3xl p-6 text-center shadow-xs">
              <div className="relative inline-block mx-auto mb-4">
                {formData.profile ? (
                  <img 
                    src={formData.profile} 
                    alt={formData.name || 'User'} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#F59E0B]/20 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#F59E0B] text-slate-950 font-black text-3xl flex items-center justify-center shadow-md">
                    {formData.name ? formData.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-theme-card" title="Account Active"></span>
              </div>

              <h2 className="text-lg font-bold text-theme-main truncate">
                {formData.name || 'Account Holder'}
              </h2>
              <p className="text-xs text-theme-muted truncate mt-0.5">
                {formData.email}
              </p>

              <div className="mt-4 pt-4 border-t border-theme-border flex items-center justify-around text-center">
                <div>
                  <div className="text-[10px] text-theme-muted uppercase tracking-wider">Account Status</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Verified</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-theme-border"></div>
                <div>
                  <div className="text-[10px] text-theme-muted uppercase tracking-wider">Profile Strength</div>
                  <div className="text-xs font-bold text-[#F59E0B] mt-0.5">
                    {completionStats.score}%
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Selection Menu */}
            <div className="bg-theme-card border border-theme-border rounded-3xl p-3 space-y-1 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'personal'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Personal & Contact Info</span>
                </div>
                {formData.name && formData.phone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'address'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery & Shipping Address</span>
                </div>
                {formData.address.addressLine && formData.address.city && formData.address.pincode ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'business'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4" />
                  <span>Business & Tax (GST)</span>
                </div>
                {formData.companyName || formData.gstin ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : null}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-xs'
                    : 'text-theme-main hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4" />
                  <span>Security & Password</span>
                </div>
                <ShieldCheck className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            {/* Quick Helper Links */}
            <div className="bg-theme-card border border-theme-border rounded-3xl p-5 space-y-3 text-xs text-theme-muted shadow-xs">
              <span className="font-bold text-theme-main block uppercase tracking-wider text-[10px]">
                Quick Shortcuts
              </span>
              <Link 
                to="/user/orders"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F59E0B]/10 hover:text-theme-main transition"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>View Wholesale Orders</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link 
                to="/seller/apply"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F59E0B]/10 hover:text-theme-main transition"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Register as a Merchant</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Right Column (8 cols): Active Tab Form Content */}
          <div className="lg:col-span-8 bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-8 shadow-xs">
            
            {/* Tab 1: Personal & Contact */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-theme-main">Personal & Contact Information</h3>
                  <p className="text-xs text-theme-muted mt-1">
                    Keep your primary contact info up to date for order confirmations and dispatch SMS alerts.
                  </p>
                </div>

                {/* Avatar Chooser */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-theme-main block">
                    Choose Your Profile Avatar
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {AVATAR_PRESETS.map((avatarUrl, idx) => {
                      const isSelected = formData.profile === avatarUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleInputChange('profile', avatarUrl)}
                          className={`relative rounded-full overflow-hidden border-2 transition p-0.5 cursor-pointer hover:scale-105 ${
                            isSelected ? 'border-[#F59E0B] shadow-md ring-2 ring-[#F59E0B]/30' : 'border-theme-border opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={avatarUrl} alt={`Avatar ${idx + 1}`} className="w-12 h-12 rounded-full object-cover" />
                          {isSelected && (
                            <span className="absolute inset-0 bg-[#F59E0B]/40 flex items-center justify-center text-slate-950 font-bold">
                              <Check className="w-4 h-4 text-white drop-shadow" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Or Custom URL */}
                  <div className="pt-2">
                    <label className="text-[11px] font-semibold text-theme-muted block mb-1">
                      Or paste a custom image URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/my-photo.jpg"
                      value={formData.profile}
                      onChange={(e) => handleInputChange('profile', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-medium"
                    />
                  </div>

                  {/* Mobile Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Mobile Number (+91) *</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-theme-muted font-mono font-semibold">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address (Read-only for security) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-main flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-theme-muted" />
                      <span>Email Address (Account Identifier)</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Verified
                    </span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-subtle text-theme-muted text-xs cursor-not-allowed font-medium opacity-80"
                  />
                  <p className="text-[11px] text-theme-muted">
                    Your email address is linked to your order records and cannot be edited directly. Contact support if you need to transfer this account.
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving Changes...' : 'Save Personal Details'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Delivery & Shipping Address */}
            {activeTab === 'address' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-theme-main">Default Delivery & Shipping Address</h3>
                  <p className="text-xs text-theme-muted mt-1">
                    This address is automatically pre-filled when you checkout from the marketplace cart.
                  </p>
                </div>

                {/* Address Line */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-main flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Street Address / Building / Area *</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Flat No, Building Name, Street / Road, Industrial Area"
                    value={formData.address.addressLine}
                    onChange={(e) => handleAddressChange('addressLine', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main">City / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Bengaluru, Jaipur"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-medium"
                    />
                  </div>

                  {/* State Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main">State / Province *</label>
                    <select
                      required
                      value={formData.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-medium"
                    >
                      <option value="">Select your state</option>
                      {INDIAN_STATES.map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main">Postal PIN Code (6 digits) *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 400001"
                      value={formData.address.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-mono font-medium"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main">Country</label>
                    <input
                      type="text"
                      disabled
                      value={formData.address.country || 'India'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-subtle text-theme-muted text-xs cursor-not-allowed font-medium opacity-80"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-theme-muted flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <p>
                    Saving your default address allows the system to compute exact delivery timelines and enables frictionless 1-click Razorpay payment processing.
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving Changes...' : 'Save Delivery Address'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Business & Tax (GST) */}
            {activeTab === 'business' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-theme-main">Commercial & Business Information</h3>
                  <p className="text-xs text-theme-muted mt-1">
                    Provide your company details and GSTIN to receive compliant tax invoices for Input Tax Credit (ITC).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Company / Firm Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Enterprise Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-medium"
                    />
                  </div>

                  {/* Business Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main">Business Entity Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-medium"
                    >
                      <option value="Individual">Individual / Consumer</option>
                      <option value="Retailer">Retail Store / Kirana</option>
                      <option value="Wholesaler">Wholesaler / Distributor</option>
                      <option value="Corporate">Corporate / Enterprise</option>
                      <option value="Manufacturer">Manufacturer / OEM</option>
                    </select>
                  </div>

                  {/* GSTIN Number */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-theme-main flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>GSTIN (15-Character Goods & Services Tax Number)</span>
                      </span>
                      <span className="text-[10px] text-theme-muted font-normal">Optional</span>
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition font-mono uppercase font-semibold tracking-wider"
                    />
                    <p className="text-[11px] text-theme-muted">
                      Your GSTIN will be automatically validated and printed on all commercial invoices and transport waybills.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving Changes...' : 'Save Business Details'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 4: Security & Password */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-theme-main">Account Security & Credentials</h3>
                  <p className="text-xs text-theme-muted mt-1">
                    Update your account password to protect your payment credentials and order records.
                  </p>
                </div>

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-main flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Current Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-theme-muted hover:text-theme-main transition cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main">New Password (min 6 characters) *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={6}
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-theme-muted hover:text-theme-main transition cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-theme-main">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-input text-theme-main text-xs focus:outline-none focus:border-[#F59E0B] transition"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{updatingPassword ? 'Updating Password...' : 'Change Password'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </main>

      <Footer />
      <CartModal />
    </div>
  );
};
