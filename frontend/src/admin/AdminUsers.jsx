import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Mail, 
  User, 
  Store,
  ChevronDown,
  Shield,
  Key,
  CheckCircle2,
  Calendar,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TableRowSkeleton } from '../components/Skeletons';
import { withSkeletonDelay } from '../utils/skeletonDelay';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      await withSkeletonDelay();
      const res = await axios.get('/admin/users');
      if (res.status === 200 && res.data.status === 1) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user records");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const res = await axios.post('/admin/users/role', { userId, role: newRole, newRole });
      if (res.status === 200 && res.data.status === 1) {
        toast.success(res.data.msg || `User permissions updated to ${newRole}`);
        fetchUsers();
      } else {
        toast.error(res.data?.msg || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error changing user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const name = u.name?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    const phone = u.phone?.toLowerCase() || '';
    return matchesRole && (name.includes(q) || email.includes(q) || phone.includes(q));
  });

  const roles = [
    { id: 'all', label: 'All Accounts' },
    { id: 'user', label: 'Buyers' },
    { id: 'seller', label: 'Merchants' },
    { id: 'admin', label: 'Admins' },
    { id: 'super_admin', label: 'Super Admins' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* ===================== HEADER ===================== */}
        <div className="bg-theme-card p-6 sm:p-7 rounded-3xl border border-theme-border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-theme-main">Access Control & Identity Governance</h1>
              <span className="bg-[#F59E0B]/10 text-amber-600 dark:text-amber-400 border border-[#F59E0B]/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                RBAC Multi-Tenant
              </span>
            </div>
            <p className="text-xs text-theme-muted">
              Manage platform permissions, assign executive administrative privileges, and audit registered buyer and merchant accounts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-theme-muted bg-theme-page border border-theme-border px-3 py-1.5 rounded-xl font-bold font-mono">
              {users.length} Total Users
            </span>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2.5 bg-theme-page hover:bg-[#F59E0B]/10 border border-theme-border text-amber-600 dark:text-amber-400 rounded-xl transition cursor-pointer disabled:opacity-50"
              title="Refresh User List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ===================== FILTERS & SEARCH ===================== */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {roles.map(r => {
              const count = r.id === 'all'
                ? users.length
                : users.filter(u => u.role === r.id).length;
              return (
                <button
                  key={r.id}
                  onClick={() => setRoleFilter(r.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    roleFilter === r.id
                      ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-2xs'
                      : 'bg-theme-card text-theme-muted border border-theme-border hover:text-theme-main hover:bg-[#F59E0B]/10'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    roleFilter === r.id ? 'bg-slate-950 text-white' : 'bg-theme-card-subtle text-theme-muted'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-theme-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-theme-input border border-theme-border rounded-xl text-theme-main placeholder:text-theme-muted/60 focus:outline-hidden focus:border-[#F59E0B] transition"
            />
          </div>

        </div>

        {/* ===================== USERS TABLE ===================== */}
        {loading ? (
          <div className="bg-theme-card rounded-3xl border border-theme-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <tbody className="divide-y divide-theme-border">
                  <TableRowSkeleton rows={6} cols={6} />
                </tbody>
              </table>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-theme-card rounded-3xl border border-theme-border p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-theme-muted/50 mx-auto" />
            <h3 className="font-bold text-base text-theme-main">No User Accounts Found</h3>
            <p className="text-xs text-theme-muted max-w-sm mx-auto">
              No registered accounts found matching your selected role filter or search criteria.
            </p>
          </div>
        ) : (
          <div className="bg-theme-card rounded-3xl border border-theme-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs text-theme-main">
                <thead className="bg-theme-card-subtle text-theme-muted uppercase text-[10px] tracking-wider border-b border-theme-border font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Account Identity</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4 text-center">System Role</th>
                    <th className="py-3.5 px-4 text-center">Seller Status</th>
                    <th className="py-3.5 px-4">Registration</th>
                    <th className="py-3.5 px-5 text-right">Assign Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border font-medium">
                  {filtered.map(u => (
                    <tr key={u._id} className="hover:bg-[#F59E0B]/5 transition">
                      {/* Identity */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 text-amber-600 dark:text-amber-400 border border-[#F59E0B]/20 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-theme-main text-xs truncate">{u.name || 'Account Holder'}</p>
                            <span className="font-mono text-[10px] text-theme-muted">ID: #{u._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <p className="text-theme-main text-xs truncate max-w-[180px]">{u.email}</p>
                        <p className="text-[11px] text-theme-muted font-mono mt-0.5">{u.phone || 'No phone'}</p>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          u.role === 'super_admin' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30' :
                          u.role === 'admin' ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30' :
                          u.role === 'seller' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                          'bg-theme-card-subtle text-theme-muted border border-theme-border'
                        }`}>
                          {u.role === 'super_admin' ? 'Super Admin' :
                           u.role === 'admin' ? 'Admin' :
                           u.role === 'seller' ? 'Merchant' : 'Buyer'}
                        </span>
                      </td>

                      {/* Seller Verification Status */}
                      <td className="py-3.5 px-4 text-center">
                        {u.role === 'seller' || u.sellerStatus !== 'none' ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                            u.sellerStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            u.sellerStatus === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse' :
                            u.sellerStatus === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                            'text-theme-muted'
                          }`}>
                            {u.sellerStatus || 'None'}
                          </span>
                        ) : (
                          <span className="text-theme-muted/50 font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-theme-muted text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>

                      {/* Assign Role Dropdown */}
                      <td className="py-3.5 px-5 text-right">
                        <select
                          value={u.role}
                          disabled={updatingId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-theme-input border border-theme-border text-theme-main text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-hidden focus:border-[#F59E0B] cursor-pointer disabled:opacity-50 transition"
                        >
                          <option value="user">User (Buyer)</option>
                          <option value="seller">Seller (Merchant)</option>
                          <option value="admin">Platform Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
