import React, { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from './AdminLayout';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Send, 
  Users, 
  Building2, 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  User, 
  AtSign, 
  Search, 
  RefreshCw, 
  Eye, 
  X, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Plus,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminMailCenter = () => {
  const user = useStore(state => state.user);

  // Email transmission logs
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Directory Data
  const [teams, setTeams] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [directoryCounts, setDirectoryCounts] = useState({ buyers: 0, sellers: 0, admins: 0, total: 0 });

  // Compose Modal State
  const [composerOpen, setComposerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [targetType, setTargetType] = useState('group'); // 'group' | 'team' | 'specific' | 'custom' | 'all'
  const [selectedGroup, setSelectedGroup] = useState('buyers');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [actionText, setActionText] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  // Selected Log for Template Inspection Modal
  const [selectedLog, setSelectedLog] = useState(null);

  // Load Email Transmission History
  const loadEmailLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/mail/history');
      if (res.data && res.data.status === 1) {
        setEmailLogs(res.data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load email history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load Recipients Directory
  const loadDirectory = async () => {
    try {
      const res = await axios.get('/notifications/directory');
      if (res.data && res.data.status === 1) {
        setTeams(res.data.teams || []);
        setRegisteredUsers(res.data.users || []);
        if (res.data.counts) {
          setDirectoryCounts(res.data.counts);
        }
        if (res.data.teams?.length > 0 && !selectedTeamId) {
          setSelectedTeamId(res.data.teams[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to load recipients directory:", err);
    }
  };

  useEffect(() => {
    loadEmailLogs();
    loadDirectory();
  }, []);

  // Filtered Users for Search
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return registeredUsers.slice(0, 15);
    const term = userSearchTerm.toLowerCase();
    return registeredUsers.filter(u => 
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    ).slice(0, 20);
  }, [registeredUsers, userSearchTerm]);

  // Selected User Object
  const selectedUserObj = useMemo(() => {
    return registeredUsers.find(u => u._id === selectedUserId);
  }, [registeredUsers, selectedUserId]);

  // Target Summary Label for Preview
  const targetSummaryText = useMemo(() => {
    if (targetType === 'group') {
      if (selectedGroup === 'buyers') return `All Buyers (${directoryCounts.buyers} emails)`;
      if (selectedGroup === 'sellers') return `All Merchants (${directoryCounts.sellers} emails)`;
      if (selectedGroup === 'admins') return `All Administrators (${directoryCounts.admins} emails)`;
      return `Everyone (${directoryCounts.total} emails)`;
    }
    if (targetType === 'team') {
      const t = teams.find(item => item._id === selectedTeamId);
      return t ? `${t.name} Team (${t.members?.length || 0} members)` : 'Select Team';
    }
    if (targetType === 'specific') {
      return selectedUserObj ? `${selectedUserObj.name} (${selectedUserObj.email})` : 'Select Registered Member';
    }
    if (targetType === 'custom') {
      return customEmail ? `Direct Email: ${customEmail}` : 'Enter Direct Address';
    }
    if (targetType === 'all') {
      return `Platform-Wide Broadcast (${directoryCounts.total} emails)`;
    }
    return '';
  }, [targetType, selectedGroup, selectedTeamId, selectedUserId, customEmail, teams, selectedUserObj, directoryCounts]);

  // Send Email Handler
  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error("Please provide an email subject.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter email body content.");
      return;
    }

    let payload = {
      subject: subject.trim(),
      message: message.trim(),
      actionText: actionText.trim(),
      actionUrl: actionUrl.trim(),
      targetType
    };

    if (targetType === 'group') {
      payload.targetId = selectedGroup;
    } else if (targetType === 'team') {
      if (!selectedTeamId) {
        toast.error("Please select a target departmental team.");
        return;
      }
      payload.targetId = selectedTeamId;
    } else if (targetType === 'specific') {
      if (!selectedUserId) {
        toast.error("Please select a registered member.");
        return;
      }
      payload.targetId = selectedUserId;
    } else if (targetType === 'custom') {
      if (!customEmail.trim() || !customEmail.includes('@')) {
        toast.error("Please enter a valid recipient email address.");
        return;
      }
      payload.customEmail = customEmail.trim();
    } else if (targetType === 'all') {
      payload.targetType = 'all';
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post('/mail/send', payload);
      if (res.data && res.data.status === 1) {
        toast.success(res.data.msg || "Email dispatched via Nodemailer!");
        setComposerOpen(false);
        // Reset form
        setSubject('');
        setMessage('');
        setActionText('');
        setActionUrl('');
        setCustomEmail('');
        setSelectedUserId('');
        // Reload logs
        loadEmailLogs();
      } else {
        toast.error(res.data?.msg || "Failed to dispatch email.");
      }
    } catch (err) {
      console.error("Email dispatch error:", err);
      toast.error(err.response?.data?.msg || err.message || "Network error while dispatching email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const totalCampaigns = emailLogs.length;
  const totalEmailsDelivered = emailLogs.reduce((sum, log) => sum + (log.recipientCount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* 1. Header & Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-theme-card border border-theme-border rounded-3xl p-6 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-amber-500/10 text-[#F59E0B] border border-amber-500/20">
                Nodemailer Engine
              </span>
              <span className="text-xs text-theme-muted">• Dedicated Administrative Mail Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-theme-main flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-[#F59E0B]" />
              <span>Mail Center & Email Campaigns</span>
            </h1>
            <p className="text-xs text-theme-muted max-w-2xl">
              Dispatch branded HTML emails via Nodemailer to specific members, entire departmental teams (HR, Finance, Operations), role groups (Buyers, Sellers, Admins), or direct external email addresses.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                loadEmailLogs();
                loadDirectory();
              }}
              className="p-2.5 rounded-xl border border-theme-border bg-theme-page hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-muted hover:text-[#F59E0B] transition cursor-pointer"
              title="Refresh Email History"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setComposerOpen(true)}
              className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Compose & Send Email</span>
            </motion.button>
          </div>
        </div>

        {/* 2. Executive Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">Total Email Campaigns</span>
              <Mail className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-theme-main">
              {totalCampaigns}
            </div>
            <div className="text-[11px] text-theme-muted mt-1">Dispatched via Nodemailer</div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">Total Inboxes Reached</span>
              <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-theme-main">
              {totalEmailsDelivered.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-theme-muted mt-1">Recipient email deliveries</div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">Platform Member Directory</span>
              <Building2 className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-theme-main">
              {directoryCounts.total}
            </div>
            <div className="text-[11px] text-theme-muted mt-1">{directoryCounts.buyers} buyers • {directoryCounts.sellers} sellers • {directoryCounts.admins} admins</div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">Active Teams Channels</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {teams.length}
            </div>
            <div className="text-[11px] text-theme-muted mt-1">HR, Finance, Operations, Legal</div>
          </div>

        </div>

        {/* 3. Email Campaigns Transmission History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-theme-border pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="font-bold text-sm text-theme-main">Nodemailer Dispatch Log & Sent Emails</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#F59E0B]/15 text-[#F59E0B]">
                {emailLogs.length} total
              </span>
            </div>

            <button
              onClick={() => setComposerOpen(true)}
              className="text-xs font-bold text-[#F59E0B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Transmission</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-theme-card border border-theme-border rounded-3xl">
              <RefreshCw className="w-6 h-6 text-[#F59E0B] animate-spin mx-auto mb-2" />
              <p className="text-xs text-theme-muted">Loading email transmission logs...</p>
            </div>
          ) : emailLogs.length === 0 ? (
            <div className="bg-theme-card border border-dashed border-theme-border rounded-3xl p-12 text-center space-y-3">
              <Mail className="w-12 h-12 text-theme-muted mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-theme-main">No Emails Sent Yet</h3>
                <p className="text-xs text-theme-muted mt-1 max-w-md mx-auto">
                  Use the composer to send branded HTML emails via Nodemailer to any group, team, or registered user.
                </p>
              </div>
              <button
                onClick={() => setComposerOpen(true)}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send First Email</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {emailLogs.map((log) => (
                <div 
                  key={log._id}
                  className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/50 rounded-2xl p-4 sm:p-5 shadow-xs transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-amber-500/15 text-[#D97706] dark:text-[#F59E0B] border border-amber-500/25 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#F59E0B]" />
                        <span>Email Transmission</span>
                      </span>

                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-theme-page text-theme-main border border-theme-border flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-[#F59E0B]" />
                        <span>{log.targetName}</span>
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        log.deliveryStatus === 'sent' 
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25'
                      }`}>
                        {log.deliveryStatus === 'sent' ? 'Nodemailer Delivered' : 'Simulated (Dev Mode)'}
                      </span>
                    </div>

                    <div className="text-[11px] text-theme-muted flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.sentAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-theme-main">
                      {log.subject}
                    </h3>
                    <p className="text-xs text-theme-muted mt-1 line-clamp-2 leading-relaxed">
                      {log.message}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-theme-muted">
                      <span className="font-medium">Dispatched by:</span>
                      <span className="font-bold text-theme-main">{log.senderName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-theme-page border border-theme-border text-theme-muted">
                        {log.senderRole}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-theme-muted">
                        Recipients Reached: <strong className="text-theme-main">{log.recipientCount}</strong> addresses
                      </span>

                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-[#F59E0B] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Template</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===================== COMPOSE EMAIL MODAL ===================== */}
        <AnimatePresence>
          {composerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8"
              >
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-theme-border flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-theme-main">
                        Compose & Dispatch Email
                      </h3>
                      <p className="text-xs text-theme-muted">
                        Nodemailer electronic mail delivery with branded HTML template
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setComposerOpen(false)}
                    className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-page cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSendEmail} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                  
                  {/* STEP 1: AUDIENCE SELECTION */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#F59E0B]" />
                      <span>1. Select Email Target Audience</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <button
                        type="button"
                        onClick={() => setTargetType('group')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          targetType === 'group'
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B] ring-1 ring-[#F59E0B]/30'
                            : 'bg-theme-page border-theme-border hover:border-theme-muted'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 text-[#F59E0B] mb-1" />
                        <div className="font-bold text-xs text-theme-main">Whole Group</div>
                        <div className="text-[10px] text-theme-muted">Buyers, Sellers</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetType('team')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          targetType === 'team'
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B] ring-1 ring-[#F59E0B]/30'
                            : 'bg-theme-page border-theme-border hover:border-theme-muted'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-[#F59E0B] mb-1" />
                        <div className="font-bold text-xs text-theme-main">Whole Team</div>
                        <div className="text-[10px] text-theme-muted">HR, Finance, Ops</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetType('specific')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          targetType === 'specific'
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B] ring-1 ring-[#F59E0B]/30'
                            : 'bg-theme-page border-theme-border hover:border-theme-muted'
                        }`}
                      >
                        <User className="w-4 h-4 text-[#F59E0B] mb-1" />
                        <div className="font-bold text-xs text-theme-main">Registered User</div>
                        <div className="text-[10px] text-theme-muted">Search Member</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetType('custom')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          targetType === 'custom'
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B] ring-1 ring-[#F59E0B]/30'
                            : 'bg-theme-page border-theme-border hover:border-theme-muted'
                        }`}
                      >
                        <AtSign className="w-4 h-4 text-[#F59E0B] mb-1" />
                        <div className="font-bold text-xs text-theme-main">Direct Email</div>
                        <div className="text-[10px] text-theme-muted">Custom Address</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetType('all')}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          targetType === 'all'
                            ? 'bg-[#F59E0B]/10 border-[#F59E0B] ring-1 ring-[#F59E0B]/30'
                            : 'bg-theme-page border-theme-border hover:border-theme-muted'
                        }`}
                      >
                        <Send className="w-4 h-4 text-[#F59E0B] mb-1" />
                        <div className="font-bold text-xs text-theme-main">Platform-Wide</div>
                        <div className="text-[10px] text-theme-muted">All Users</div>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-theme-page border border-theme-border">
                      {targetType === 'group' && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold text-theme-muted">Select Target Group:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs font-semibold ${
                              selectedGroup === 'buyers' ? 'bg-[#F59E0B] text-slate-950 font-bold border-[#F59E0B]' : 'bg-theme-card border-theme-border text-theme-main'
                            }`}>
                              <span>All Buyers</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10">{directoryCounts.buyers}</span>
                              <input 
                                type="radio" 
                                name="emailGroupRadio" 
                                className="hidden" 
                                checked={selectedGroup === 'buyers'} 
                                onChange={() => setSelectedGroup('buyers')} 
                              />
                            </label>

                            <label className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs font-semibold ${
                              selectedGroup === 'sellers' ? 'bg-[#F59E0B] text-slate-950 font-bold border-[#F59E0B]' : 'bg-theme-card border-theme-border text-theme-main'
                            }`}>
                              <span>All Merchants</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10">{directoryCounts.sellers}</span>
                              <input 
                                type="radio" 
                                name="emailGroupRadio" 
                                className="hidden" 
                                checked={selectedGroup === 'sellers'} 
                                onChange={() => setSelectedGroup('sellers')} 
                              />
                            </label>

                            <label className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs font-semibold ${
                              selectedGroup === 'admins' ? 'bg-[#F59E0B] text-slate-950 font-bold border-[#F59E0B]' : 'bg-theme-card border-theme-border text-theme-main'
                            }`}>
                              <span>All Admins</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10">{directoryCounts.admins}</span>
                              <input 
                                type="radio" 
                                name="emailGroupRadio" 
                                className="hidden" 
                                checked={selectedGroup === 'admins'} 
                                onChange={() => setSelectedGroup('admins')} 
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {targetType === 'team' && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold text-theme-muted">Select Target Team:</span>
                          <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full bg-theme-card border border-theme-border rounded-xl px-3.5 py-2.5 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden cursor-pointer"
                          >
                            {teams.map(t => (
                              <option key={t._id} value={t._id}>
                                {t.name} ({t.department}) • {t.members?.length || 0} Members
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {targetType === 'specific' && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold text-theme-muted">Search Registered User:</span>
                          <div className="relative">
                            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Type name or email..."
                              value={userSearchTerm}
                              onChange={(e) => setUserSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-theme-card border border-theme-border rounded-xl text-xs text-theme-main focus:border-[#F59E0B] outline-hidden"
                            />
                          </div>

                          <div className="max-h-36 overflow-y-auto space-y-1 pt-1 border-t border-theme-border">
                            {filteredUsers.map(u => (
                              <button
                                key={u._id}
                                type="button"
                                onClick={() => setSelectedUserId(u._id)}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition cursor-pointer ${
                                  selectedUserId === u._id 
                                    ? 'bg-[#F59E0B] text-slate-950 font-bold' 
                                    : 'hover:bg-theme-card text-theme-main'
                                }`}
                              >
                                <div>
                                  <span className="font-semibold">{u.name}</span>
                                  <span className="text-[11px] opacity-75 ml-2 font-mono">({u.email})</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-black/10">
                                  {u.role}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {targetType === 'custom' && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold text-theme-muted">Direct Recipient Email:</span>
                          <input
                            type="email"
                            placeholder="e.g. partner@enterprise.com or client@company.org"
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                            className="w-full bg-theme-card border border-theme-border rounded-xl px-3.5 py-2.5 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden"
                          />
                        </div>
                      )}

                      {targetType === 'all' && (
                        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-300 text-xs">
                          <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                          <span>This email will be delivered to the registered inbox of all platform users ({directoryCounts.total} recipients).</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STEP 2: CONTENT */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                      <span>2. Email Subject & Message Body</span>
                    </label>

                    <div>
                      <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Email Subject *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Platform Regulatory Notice & Commercial Terms Update"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-theme-page border border-theme-border rounded-xl px-3.5 py-2.5 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Message Content *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Dear Partner,&#10;&#10;We are writing to communicate important platform updates regarding your account..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-theme-page border border-theme-border rounded-xl p-3 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Button Label (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Review Terms & Conditions"
                          value={actionText}
                          onChange={(e) => setActionText(e.target.value)}
                          className="w-full bg-theme-page border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Button URL Link (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. https://bizmart.realbell.in"
                          value={actionUrl}
                          onChange={(e) => setActionUrl(e.target.value)}
                          className="w-full bg-theme-page border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: LIVE PREVIEW */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-theme-page to-theme-page border border-amber-500/25 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F59E0B] flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live HTML Email Preview</span>
                      </span>
                      <span className="text-[11px] font-mono text-theme-muted">
                        To: <strong className="text-theme-main">{targetSummaryText}</strong>
                      </span>
                    </div>

                    <div className="rounded-xl border border-theme-border overflow-hidden bg-white text-slate-900 shadow-md">
                      <div className="bg-[#172033] px-4 py-3 flex items-center justify-between border-b-2 border-[#F59E0B]">
                        <span className="text-[#F59E0B] font-black text-sm">RealBell <span className="text-white">BizMart</span></span>
                        <span className="text-[10px] text-[#F59E0B] font-bold uppercase">Official Transmission</span>
                      </div>
                      <div className="p-4 space-y-2 text-xs">
                        <div className="font-extrabold text-sm text-slate-900">
                          {subject || 'Subject line preview will appear here'}
                        </div>
                        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                          {message || 'Your email body text will be formatted and styled cleanly here...'}
                        </p>
                        {actionText && (
                          <div className="pt-2 text-center">
                            <span className="inline-block bg-[#F59E0B] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-xs">
                              {actionText} &rarr;
                            </span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500">
                          Dispatched by: <strong>{user?.name || 'Administrator'}</strong> ({user?.role === 'super_admin' ? 'Super Admin' : 'Admin'})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-theme-border">
                    <button
                      type="button"
                      onClick={() => setComposerOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-theme-border text-xs font-semibold text-theme-muted hover:text-theme-main cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching via Nodemailer...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Email Now</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ===================== VIEW TEMPLATE MODAL ===================== */}
        <AnimatePresence>
          {selectedLog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#F59E0B]" />
                    <h3 className="font-bold text-base text-theme-main">Nodemailer Transmission Record</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedLog(null)}
                    className="p-1 rounded-lg text-theme-muted hover:text-theme-main cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-theme-muted">Subject:</span>
                    <h4 className="text-base font-bold text-theme-main mt-0.5">{selectedLog.subject}</h4>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-theme-muted">Target Audience:</span>
                    <p className="text-xs font-semibold text-theme-main mt-0.5">{selectedLog.targetName} ({selectedLog.recipientCount} emails)</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-theme-muted">Message Content:</span>
                    <p className="text-xs text-theme-main mt-0.5 p-3 rounded-xl bg-theme-page border border-theme-border whitespace-pre-wrap leading-relaxed">
                      {selectedLog.message}
                    </p>
                  </div>

                  {selectedLog.actionText && (
                    <div className="p-3 rounded-xl bg-theme-page border border-theme-border text-xs flex items-center justify-between">
                      <span className="text-theme-muted">Action CTA: <strong>{selectedLog.actionText}</strong></span>
                      <span className="text-[11px] font-mono text-[#F59E0B] truncate max-w-xs">{selectedLog.actionUrl}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-theme-page border border-theme-border space-y-1">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Sender</span>
                      <div className="font-bold text-xs text-theme-main">{selectedLog.senderName} ({selectedLog.senderRole})</div>
                    </div>
                    <div className="p-3 rounded-xl bg-theme-page border border-theme-border space-y-1">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Transmission Status</span>
                      <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400 capitalize">{selectedLog.deliveryStatus}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-theme-border flex justify-end">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-2 rounded-xl bg-[#F59E0B] text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Close
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
