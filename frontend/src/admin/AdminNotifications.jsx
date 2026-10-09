import React, { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from './AdminLayout';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { toast } from 'react-toastify';
import { 
  Bell, 
  Send, 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  Radio, 
  Building2, 
  ShoppingBag, 
  Store, 
  User, 
  Trash2, 
  CheckCheck, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  X,
  RefreshCw,
  Eye,
  Megaphone,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminNotifications = () => {
  const user = useStore(state => state.user);
  const fetchUnreadCount = useStore(state => state.fetchUnreadNotificationsCount);

  // Active view: 'broadcasts' (In-App Broadcasts & Analytics) or 'inbox' (Admin's personal notifications)
  const [activeTab, setActiveTab] = useState('broadcasts');

  // Broadcasts & History
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastsLoading, setBroadcastsLoading] = useState(true);

  // Admin's Inbox
  const [inboxList, setInboxList] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(true);

  // Directory Data for Composer
  const [teams, setTeams] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [directoryCounts, setDirectoryCounts] = useState({ buyers: 0, sellers: 0, admins: 0, total: 0 });

  // Compose Modal State
  const [composerOpen, setComposerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [targetType, setTargetType] = useState('group'); // 'group' | 'team' | 'specific' | 'all'
  const [selectedGroup, setSelectedGroup] = useState('buyers'); // 'buyers' | 'sellers' | 'admins' | 'all'
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formType, setFormType] = useState('info'); // 'info' | 'announcement' | 'warning' | 'urgent' | 'success'
  const [formPriority, setFormPriority] = useState('normal'); // 'normal' | 'high' | 'urgent'
  const [formLink, setFormLink] = useState('');

  // Selected Broadcast Details Modal
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);

  // Fetch broadcasts history
  const loadBroadcasts = async () => {
    try {
      setBroadcastsLoading(true);
      const res = await axios.get('/notifications/broadcasts');
      if (res.data && res.data.status === 1) {
        setBroadcasts(res.data.broadcasts || []);
      }
    } catch (err) {
      console.error("Failed to load broadcasts:", err);
    } finally {
      setBroadcastsLoading(false);
    }
  };

  // Fetch Admin's Inbox
  const loadInbox = async () => {
    try {
      setInboxLoading(true);
      const res = await axios.get('/notifications/my?limit=50');
      if (res.data && res.data.status === 1) {
        setInboxList(res.data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load inbox:", err);
    } finally {
      setInboxLoading(false);
    }
  };

  // Fetch Directory (Teams & Users)
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
    loadBroadcasts();
    loadInbox();
    loadDirectory();
  }, []);

  // Filtered Users for Specific Recipient Search
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return registeredUsers.slice(0, 15);
    const term = userSearchTerm.toLowerCase();
    return registeredUsers.filter(u => 
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    ).slice(0, 20);
  }, [registeredUsers, userSearchTerm]);

  // Selected user object
  const selectedUserObj = useMemo(() => {
    return registeredUsers.find(u => u._id === selectedUserId);
  }, [registeredUsers, selectedUserId]);

  // Target description label for composer preview
  const targetSummaryText = useMemo(() => {
    if (targetType === 'group') {
      if (selectedGroup === 'buyers') return `All Buyers (${directoryCounts.buyers} recipients)`;
      if (selectedGroup === 'sellers') return `All Merchants & Sellers (${directoryCounts.sellers} recipients)`;
      if (selectedGroup === 'admins') return `All Administrative Staff (${directoryCounts.admins} recipients)`;
      return `Everyone on Platform (${directoryCounts.total} recipients)`;
    }
    if (targetType === 'team') {
      const t = teams.find(item => item._id === selectedTeamId);
      return t ? `${t.name} Team (${t.members?.length || 0} members)` : 'Select Team';
    }
    if (targetType === 'specific') {
      return selectedUserObj ? `${selectedUserObj.name} (${selectedUserObj.email})` : 'Select Member';
    }
    if (targetType === 'all') {
      return `Platform-Wide Broadcast (${directoryCounts.total} registered users)`;
    }
    return '';
  }, [targetType, selectedGroup, selectedTeamId, selectedUserId, teams, selectedUserObj, directoryCounts]);

  // Handle Send In-App Broadcast
  const handleDispatch = async (e) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      toast.error("Please enter a notification title.");
      return;
    }
    if (!formMessage.trim()) {
      toast.error("Please enter notification body content.");
      return;
    }

    let payload = {
      title: formTitle.trim(),
      message: formMessage.trim(),
      type: formType,
      priority: formPriority,
      link: formLink.trim(),
      targetType
    };

    if (targetType === 'group') {
      payload.targetId = selectedGroup;
    } else if (targetType === 'team') {
      if (!selectedTeamId) {
        toast.error("Please select a target team.");
        return;
      }
      payload.targetId = selectedTeamId;
    } else if (targetType === 'specific') {
      if (!selectedUserId) {
        toast.error("Please select a specific recipient.");
        return;
      }
      payload.targetId = selectedUserId;
    } else if (targetType === 'all') {
      payload.targetType = 'all';
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post('/notifications/send', payload);
      if (res.data && res.data.status === 1) {
        toast.success(res.data.msg || "In-app notification dispatched successfully!");
        setComposerOpen(false);
        // Reset form
        setFormTitle('');
        setFormMessage('');
        setFormLink('');
        setFormPriority('normal');
        setFormType('info');
        setSelectedUserId('');
        // Reload broadcasts & inbox
        loadBroadcasts();
        loadInbox();
        fetchUnreadCount();
      } else {
        toast.error(res.data?.msg || "Failed to dispatch notification.");
      }
    } catch (err) {
      console.error("Dispatch error:", err);
      toast.error(err.response?.data?.msg || err.message || "Network error while dispatching notification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark single inbox item as read
  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(`/notifications/${id}/read`);
      if (res.data && res.data.status === 1) {
        setInboxList(prev => prev.map(item => item._id === id ? { ...item, isRead: true } : item));
        fetchUnreadCount();
      }
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // Mark all inbox items as read
  const handleMarkAllRead = async () => {
    try {
      const res = await axios.put('/notifications/mark-all-read');
      if (res.data && res.data.status === 1) {
        setInboxList(prev => prev.map(item => ({ ...item, isRead: true })));
        toast.success("All personal notifications marked as read.");
        fetchUnreadCount();
      }
    } catch (err) {
      toast.error("Failed to mark all as read.");
    }
  };

  // Delete inbox item
  const handleDeleteInboxItem = async (id) => {
    try {
      const res = await axios.delete(`/notifications/${id}`);
      if (res.data && res.data.status === 1) {
        setInboxList(prev => prev.filter(item => item._id !== id));
        toast.success("Notification removed.");
        fetchUnreadCount();
      }
    } catch (err) {
      toast.error("Failed to remove notification.");
    }
  };

  // Metrics computation
  const totalBroadcastsCount = broadcasts.length;
  const totalDeliveriesCount = broadcasts.reduce((sum, b) => sum + (b.totalRecipients || 0), 0);
  const totalReadsCount = broadcasts.reduce((sum, b) => sum + (b.readCount || 0), 0);
  const readRatePercentage = totalDeliveriesCount > 0 ? Math.round((totalReadsCount / totalDeliveriesCount) * 100) : 0;
  const unreadInboxCount = inboxList.filter(n => !n.isRead).length;

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* 1. Header & Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-theme-card border border-theme-border rounded-3xl p-6 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-amber-500/10 text-[#F59E0B] border border-amber-500/20">
                In-App Feed Engine
              </span>
              <span className="text-xs text-theme-muted">• Unified Broadcast Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-theme-main flex items-center gap-2.5">
              <Megaphone className="w-6 h-6 text-[#F59E0B]" />
              <span>Notification & Broadcast Center</span>
            </h1>
            <p className="text-xs text-theme-muted max-w-2xl">
              Target specific members, entire departmental teams (HR, Finance, Operations), role groups (Buyers, Sellers, Admins), or broadcast platform-wide in-app notifications with live read receipts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                loadBroadcasts();
                loadInbox();
              }}
              className="p-2.5 rounded-xl border border-theme-border bg-theme-page hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-muted hover:text-[#F59E0B] transition cursor-pointer"
              title="Refresh Broadcasts"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setComposerOpen(true)}
              className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Compose In-App Alert</span>
            </motion.button>
          </div>
        </div>

        {/* 2. Executive Metrics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">Total In-App Alerts</span>
              <Megaphone className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-theme-main">
              {totalBroadcastsCount}
            </div>
            <div className="text-[11px] text-theme-muted mt-1">Multi-channel campaigns</div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">Total Delivered Inboxes</span>
              <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-theme-main">
              {totalDeliveriesCount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-theme-muted mt-1">Recipients reached</div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">Overall Read Rate</span>
              <CheckCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {readRatePercentage}%
            </div>
            <div className="text-[11px] text-theme-muted mt-1">{totalReadsCount} confirmed reads</div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-theme-muted mb-2">
              <span className="text-xs font-semibold">My Admin Inbox</span>
              <Bell className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-theme-main flex items-center gap-2">
              <span>{inboxList.length}</span>
              {unreadInboxCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-[#F59E0B] border border-amber-500/25">
                  {unreadInboxCount} new
                </span>
              )}
            </div>
            <div className="text-[11px] text-theme-muted mt-1">Direct alerts to your account</div>
          </div>

        </div>

        {/* 3. Section Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('broadcasts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'broadcasts'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/10'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Log & Campaigns</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'broadcasts' ? 'bg-slate-950/20 text-slate-950' : 'bg-theme-card border border-theme-border'
              }`}>
                {broadcasts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-[#F59E0B] text-slate-950 shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-[#F59E0B]/10'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>My Received Alerts</span>
              {unreadInboxCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'inbox' ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {unreadInboxCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'inbox' && inboxList.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-[#F59E0B] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* 4. TAB 1: BROADCASTS & CAMPAIGNS LOG */}
        {activeTab === 'broadcasts' && (
          <div className="space-y-4">
            {broadcastsLoading ? (
              <div className="p-12 text-center bg-theme-card border border-theme-border rounded-3xl">
                <RefreshCw className="w-6 h-6 text-[#F59E0B] animate-spin mx-auto mb-2" />
                <p className="text-xs text-theme-muted">Loading broadcast campaigns...</p>
              </div>
            ) : broadcasts.length === 0 ? (
              <div className="bg-theme-card border border-dashed border-theme-border rounded-3xl p-12 text-center space-y-3">
                <Megaphone className="w-12 h-12 text-theme-muted mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-theme-main">No Broadcasts Sent Yet</h3>
                  <p className="text-xs text-theme-muted mt-1 max-w-md mx-auto">
                    Start by composing a broadcast to notify all buyers, merchants, departmental teams, or specific staff members.
                  </p>
                </div>
                <button
                  onClick={() => setComposerOpen(true)}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Send First In-App Alert</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {broadcasts.map((b) => {
                  const readPct = b.totalRecipients > 0 ? Math.round((b.readCount / b.totalRecipients) * 100) : 0;
                  return (
                    <div 
                      key={b._id}
                      className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/50 rounded-2xl p-4 sm:p-5 shadow-xs transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            b.type === 'urgent' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25' :
                            b.type === 'warning' ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25' :
                            b.type === 'announcement' ? 'bg-[#F59E0B]/15 text-[#D97706] dark:text-[#F59E0B] border border-[#F59E0B]/25' :
                            'bg-theme-page text-theme-muted border border-theme-border'
                          }`}>
                            {b.type}
                          </span>

                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-[#F59E0B]" />
                            <span>{b.targetName || 'Audience'}</span>
                          </span>

                          {b.priority === 'urgent' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-rose-500" />
                              <span>Urgent Priority</span>
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-theme-muted flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(b.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-theme-main">
                          {b.title}
                        </h3>
                        <p className="text-xs text-theme-muted mt-1 line-clamp-2 leading-relaxed">
                          {b.message}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-theme-muted">
                          <span className="font-medium">Dispatched by:</span>
                          <span className="font-bold text-theme-main">{b.senderName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-theme-page border border-theme-border text-theme-muted">
                            {b.senderRole}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-theme-muted">
                              Reads: <strong className="text-theme-main">{b.readCount}</strong>/{b.totalRecipients} ({readPct}%)
                            </span>
                            <div className="w-16 h-2 rounded-full bg-theme-page border border-theme-border overflow-hidden">
                              <div 
                                className="h-full bg-[#F59E0B] rounded-full transition-all duration-300" 
                                style={{ width: `${readPct}%` }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedBroadcast(b)}
                            className="text-[#F59E0B] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 2: MY ADMIN INBOX */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            {inboxLoading ? (
              <div className="p-12 text-center bg-theme-card border border-theme-border rounded-3xl">
                <RefreshCw className="w-6 h-6 text-[#F59E0B] animate-spin mx-auto mb-2" />
                <p className="text-xs text-theme-muted">Loading your notifications...</p>
              </div>
            ) : inboxList.length === 0 ? (
              <div className="bg-theme-card border border-dashed border-theme-border rounded-3xl p-12 text-center space-y-3">
                <Bell className="w-12 h-12 text-theme-muted mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-theme-main">Your Inbox is Clear</h3>
                  <p className="text-xs text-theme-muted mt-1">
                    No active notifications or alerts assigned to your administrative account.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {inboxList.map((item) => (
                  <div
                    key={item._id}
                    className={`bg-theme-card border rounded-2xl p-4 sm:p-5 shadow-xs transition space-y-2.5 ${
                      !item.isRead ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]/20 bg-amber-500/5' : 'border-theme-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          item.priority === 'urgent' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'bg-theme-page text-theme-muted border border-theme-border'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-[11px] font-semibold text-theme-muted">
                          From: <strong className="text-theme-main">{item.senderName}</strong> ({item.senderRole})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-theme-muted">
                          {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(item._id)}
                            className="p-1 rounded-lg text-theme-muted hover:text-[#F59E0B] cursor-pointer"
                            title="Mark as Read"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInboxItem(item._id)}
                          className="p-1 rounded-lg text-theme-muted hover:text-rose-500 cursor-pointer"
                          title="Dismiss Notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-theme-main">{item.title}</h4>
                    <p className="text-xs text-theme-muted leading-relaxed">{item.message}</p>

                    {item.link && (
                      <div className="pt-1">
                        <a 
                          href={item.link} 
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#F59E0B] hover:underline"
                        >
                          <span>Open Associated Action</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== COMPOSE IN-APP BROADCAST MODAL ===================== */}
        <AnimatePresence>
          {composerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8"
              >
                <div className="p-5 sm:p-6 border-b border-theme-border flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold shadow-xs">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-theme-main">
                        Compose In-App Notification
                      </h3>
                      <p className="text-xs text-theme-muted">
                        Delivers directly into user, merchant, or admin notification center feeds
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

                <form onSubmit={handleDispatch} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#F59E0B]" />
                      <span>1. Select Delivery Audience</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                        <div className="font-bold text-xs text-theme-main">Specific Person</div>
                        <div className="text-[10px] text-theme-muted">Registered user</div>
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
                        <Megaphone className="w-4 h-4 text-[#F59E0B] mb-1" />
                        <div className="font-bold text-xs text-theme-main">Platform-Wide</div>
                        <div className="text-[10px] text-theme-muted">All accounts</div>
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
                                name="groupSelect" 
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
                                name="groupSelect" 
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
                                name="groupSelect" 
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
                          <span className="text-[11px] font-semibold text-theme-muted">Select Departmental Team:</span>
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
                          <span className="text-[11px] font-semibold text-theme-muted">Search & Pick Platform Member:</span>
                          <div className="relative">
                            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Type name, email, or role..."
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

                      {targetType === 'all' && (
                        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-300 text-xs">
                          <Megaphone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                          <span>This alert will be delivered into the notification feed of all platform users.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                      <span>2. Notification Message Parameters</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Category / Type</label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          className="w-full bg-theme-page border border-theme-border rounded-xl px-3 py-2 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden cursor-pointer"
                        >
                          <option value="info">General Information</option>
                          <option value="announcement">Platform Announcement</option>
                          <option value="warning">Compliance / Warning</option>
                          <option value="urgent">Urgent Action Required</option>
                          <option value="success">Success / Milestone</option>
                          <option value="system">System Maintenance</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Priority Level</label>
                        <select
                          value={formPriority}
                          onChange={(e) => setFormPriority(e.target.value)}
                          className="w-full bg-theme-page border border-theme-border rounded-xl px-3 py-2 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden cursor-pointer"
                        >
                          <option value="normal">Normal Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent (Highlighted Alert)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Headline / Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Scheduled Maintenance or Tax Compliance Update"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full bg-theme-page border border-theme-border rounded-xl px-3.5 py-2.5 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Message Content *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Provide clear details and instructions for the recipients..."
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        className="w-full bg-theme-page border border-theme-border rounded-xl p-3 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-theme-muted mb-1 block">Action Link (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. /seller/dashboard or /user/orders"
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        className="w-full bg-theme-page border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-main focus:border-[#F59E0B] outline-hidden"
                      />
                    </div>
                  </div>

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
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Dispatch Alert Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ===================== VIEW BROADCAST DETAILS MODAL ===================== */}
        <AnimatePresence>
          {selectedBroadcast && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#F59E0B]" />
                    <h3 className="font-bold text-base text-theme-main">Campaign Analytics</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedBroadcast(null)}
                    className="p-1 rounded-lg text-theme-muted hover:text-theme-main cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-theme-muted">Broadcast Title:</span>
                    <h4 className="text-base font-bold text-theme-main mt-0.5">{selectedBroadcast.title}</h4>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-theme-muted">Message Body:</span>
                    <p className="text-xs text-theme-main mt-0.5 p-3 rounded-xl bg-theme-page border border-theme-border whitespace-pre-wrap leading-relaxed">
                      {selectedBroadcast.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-theme-page border border-theme-border space-y-1">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Targeted Audience</span>
                      <div className="font-bold text-xs text-theme-main">{selectedBroadcast.targetName}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-theme-page border border-theme-border space-y-1">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Dispatched By</span>
                      <div className="font-bold text-xs text-theme-main">{selectedBroadcast.senderName} ({selectedBroadcast.senderRole})</div>
                    </div>

                    <div className="p-3 rounded-xl bg-theme-page border border-theme-border space-y-1">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Total Delivered</span>
                      <div className="font-bold text-xs text-theme-main">{selectedBroadcast.totalRecipients} Inboxes</div>
                    </div>

                    <div className="p-3 rounded-xl bg-theme-page border border-theme-border space-y-1">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Confirmed Reads</span>
                      <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {selectedBroadcast.readCount} ({selectedBroadcast.totalRecipients > 0 ? Math.round((selectedBroadcast.readCount / selectedBroadcast.totalRecipients) * 100) : 0}%)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-theme-border flex justify-end">
                  <button
                    onClick={() => setSelectedBroadcast(null)}
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
