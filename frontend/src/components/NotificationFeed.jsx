import React, { useState, useEffect, useMemo } from 'react';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Flame, 
  Megaphone, 
  RefreshCw, 
  Filter, 
  Sparkles,
  ShieldAlert,
  Info,
  CheckCircle2,
  Building2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationFeed = ({ role = 'buyer' }) => {
  const navigate = useNavigate();
  const fetchUnreadCount = useStore(state => state.fetchUnreadNotificationsCount);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'urgent' | 'announcements'

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/notifications/my?limit=50');
      if (res.data && res.data.status === 1) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Mark single as read
  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(`/notifications/${id}/read`);
      if (res.data && res.data.status === 1) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        fetchUnreadCount();
      }
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const res = await axios.put('/notifications/mark-all-read');
      if (res.data && res.data.status === 1) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read.");
        fetchUnreadCount();
      }
    } catch (err) {
      toast.error("Failed to mark notifications as read.");
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/notifications/${id}`);
      if (res.data && res.data.status === 1) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        toast.success("Notification dismissed.");
        fetchUnreadCount();
      }
    } catch (err) {
      toast.error("Failed to dismiss notification.");
    }
  };

  // Format relative time
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  // Filtered Notifications
  const filteredList = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'unread') return !n.isRead;
      if (filter === 'urgent') return n.priority === 'urgent' || n.type === 'urgent';
      if (filter === 'announcements') return n.type === 'announcement';
      return true;
    });
  }, [notifications, filter]);

  const unreadTotal = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-theme-card border border-theme-border rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {role === 'merchant' ? 'Merchant Communications' : 'Platform Feed'}
            </span>
            {unreadTotal > 0 && (
              <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
                <span>{unreadTotal} Unread</span>
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-theme-main flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#F59E0B]" />
            <span>{role === 'merchant' ? 'Merchant Notification Center' : 'Notifications & Updates'}</span>
          </h2>
          <p className="text-xs text-theme-muted">
            {role === 'merchant'
              ? 'Official announcements, dispatch alerts, departmental notices, and compliance advisories from management.'
              : 'Direct notifications regarding your marketplace orders, platform announcements, and exclusive alerts.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadNotifications}
            className="p-2 rounded-xl border border-theme-border bg-theme-page hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-theme-muted hover:text-[#F59E0B] transition cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {unreadTotal > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border hover:border-[#F59E0B] text-xs font-bold text-theme-main transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-theme-page border border-theme-border w-fit">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'all'
              ? 'bg-[#F59E0B] text-slate-950 shadow-xs'
              : 'text-theme-muted hover:text-theme-main'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#F59E0B] text-slate-950 shadow-xs'
              : 'text-theme-muted hover:text-theme-main'
          }`}
        >
          Unread ({unreadTotal})
        </button>

        <button
          type="button"
          onClick={() => setFilter('urgent')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'urgent'
              ? 'bg-[#F59E0B] text-slate-950 shadow-xs'
              : 'text-theme-muted hover:text-theme-main'
          }`}
        >
          Urgent Alerts
        </button>

        <button
          type="button"
          onClick={() => setFilter('announcements')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'announcements'
              ? 'bg-[#F59E0B] text-slate-950 shadow-xs'
              : 'text-theme-muted hover:text-theme-main'
          }`}
        >
          Announcements
        </button>
      </div>

      {/* Notifications Feed List */}
      {loading ? (
        <div className="py-12 text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-[#F59E0B] animate-spin mx-auto" />
          <p className="text-xs text-theme-muted">Fetching notifications...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-12 border border-dashed border-theme-border rounded-2xl p-6 text-center space-y-3">
          <Bell className="w-10 h-10 text-theme-muted mx-auto opacity-60" />
          <div>
            <h4 className="text-xs font-bold text-theme-main">No Notifications in this View</h4>
            <p className="text-xs text-theme-muted mt-0.5">
              {filter === 'unread' ? "You're all caught up! No unread messages." : "No notifications have been received yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((notif) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={notif._id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                !notif.isRead
                  ? 'bg-amber-500/5 border-[#F59E0B] shadow-xs ring-1 ring-[#F59E0B]/15'
                  : 'bg-theme-page border-theme-border hover:border-theme-muted'
              }`}
            >
              {/* Header: Sender tag, Type pill, Timestamp, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0 animate-pulse"></span>
                  )}

                  {/* Priority / Type pill */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    notif.priority === 'urgent' || notif.type === 'urgent'
                      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25'
                      : notif.type === 'announcement'
                      ? 'bg-[#F59E0B]/15 text-[#D97706] dark:text-[#F59E0B] border border-[#F59E0B]/25'
                      : notif.type === 'warning'
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25'
                      : 'bg-theme-card text-theme-muted border border-theme-border'
                  }`}>
                    {notif.type}
                  </span>

                  {/* Sender Badge */}
                  <span className="text-[11px] font-semibold text-theme-muted flex items-center gap-1">
                    <span>From:</span>
                    <strong className="text-theme-main">{notif.senderName}</strong>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-theme-card border border-theme-border text-theme-muted">
                      {notif.senderRole}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-theme-muted self-end sm:self-auto">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeAgo(notif.createdAt)}</span>
                  </div>

                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="p-1 rounded-lg text-theme-muted hover:text-[#F59E0B] cursor-pointer"
                      title="Mark as Read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(notif._id)}
                    className="p-1 rounded-lg text-theme-muted hover:text-rose-500 cursor-pointer"
                    title="Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Message */}
              <div>
                <h3 className="font-bold text-sm sm:text-base text-theme-main">
                  {notif.title}
                </h3>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed whitespace-pre-wrap">
                  {notif.message}
                </p>
              </div>

              {/* Action Link Button if Available */}
              {notif.link && (
                <div className="pt-2 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (!notif.isRead) handleMarkAsRead(notif._id);
                      if (notif.link.startsWith('http')) {
                        window.open(notif.link, '_blank');
                      } else {
                        navigate(notif.link);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] hover:text-[#D97706] hover:underline cursor-pointer"
                  >
                    <span>View Associated Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};
