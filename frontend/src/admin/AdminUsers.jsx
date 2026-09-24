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
  ChevronDown
} from 'lucide-react';

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
      const res = await axios.get('/admin/users');
      if (res.status === 200 && res.data.status === 1) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const res = await axios.post('/admin/users/role', { userId, newRole });
      if (res.status === 200 && res.data.status === 1) {
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      } else {
        toast.error("Failed to change role");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error changing role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchesSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">User Accounts & Access Control</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage permissions, promote administrators, and review buyer & seller accounts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
              {users.length} Registered Accounts
            </span>
            <button
              onClick={fetchUsers}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {['all', 'user', 'seller', 'admin', 'super_admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition whitespace-nowrap ${
                  roleFilter === r
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading user accounts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-950/60 rounded-3xl border border-slate-800 p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-300">No Users Found</h3>
          </div>
        ) : (
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Current Role</th>
                    <th className="px-6 py-4">Seller Status</th>
                    <th className="px-6 py-4">Registered Date</th>
                    <th className="px-6 py-4 text-right">Assign Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filtered.map(u => (
                    <tr key={u._id} className="hover:bg-slate-900/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-slate-400 text-[11px]">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          u.role === 'seller' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {u.role === 'seller' ? (
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] capitalize ${
                            u.sellerStatus === 'approved' ? 'text-emerald-400' :
                            u.sellerStatus === 'pending' ? 'text-amber-400' :
                            'text-slate-400'
                          }`}>
                            {u.sellerStatus}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          disabled={updatingId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-hidden focus:border-amber-500 cursor-pointer disabled:opacity-50"
                        >
                          <option value="user">User (Buyer)</option>
                          <option value="seller">Seller (Shopkeeper)</option>
                          <option value="admin">Admin</option>
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
