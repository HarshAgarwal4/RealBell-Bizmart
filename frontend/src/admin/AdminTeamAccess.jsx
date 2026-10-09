import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import axios from '../services/axios';
import { useStore } from '../zustand/store';
import { toast } from 'react-toastify';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  UserPlus, 
  X, 
  Check, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Mail, 
  User, 
  Layers, 
  BadgeCheck, 
  Key, 
  Crown,
  Briefcase,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminTeamAccess = () => {
  const currentUser = useStore(state => state.user);
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformUsers, setPlatformUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Selected Team for Member Management Modal
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Create / Edit Team Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    department: 'Operations',
    description: '',
    permissions: []
  });

  // Add Member Form State
  const [memberFormData, setMemberFormData] = useState({
    userId: '',
    designation: '',
    accessLevel: 'member'
  });
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchPlatformUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/teams');
      if (res.status === 200 && res.data.status === 1) {
        setTeams(res.data.teams || []);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      toast.error("Failed to load department teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformUsers = async (query = '') => {
    try {
      const res = await axios.get(`/admin/teams/users/search${query ? `?search=${query}` : ''}`);
      if (res.status === 200 && res.data.status === 1) {
        setPlatformUsers(res.data.users || []);
      }
    } catch (err) {
      console.error("Error fetching platform users:", err);
    }
  };

  // Open Create Team Modal
  const handleOpenCreateModal = () => {
    setIsEditingTeam(false);
    setTeamFormData({
      name: '',
      department: 'HR',
      description: '',
      permissions: []
    });
    setIsTeamModalOpen(true);
  };

  // Open Edit Team Modal
  const handleOpenEditModal = (team) => {
    setIsEditingTeam(true);
    setTeamFormData({
      id: team._id,
      name: team.name,
      department: team.department,
      description: team.description || '',
      permissions: team.permissions || []
    });
    setIsTeamModalOpen(true);
  };

  // Quick preset template loader
  const handleLoadPreset = (deptName, deptKey, desc) => {
    setTeamFormData({
      ...teamFormData,
      name: deptName,
      department: deptKey,
      description: desc
    });
  };

  // Submit Team Create / Update
  const handleSubmitTeam = async (e) => {
    e.preventDefault();
    if (!teamFormData.name.trim()) {
      toast.warning("Team name is required");
      return;
    }

    try {
      if (isEditingTeam) {
        const res = await axios.put(`/admin/teams/${teamFormData.id}`, teamFormData);
        if (res.status === 200 && res.data.status === 1) {
          toast.success(res.data.msg || "Team updated successfully");
          setIsTeamModalOpen(false);
          fetchTeams();
        } else {
          toast.error(res.data?.msg || "Could not update team");
        }
      } else {
        const res = await axios.post('/admin/teams', teamFormData);
        if (res.status === 200 && res.data.status === 1) {
          toast.success(res.data.msg || "New team created successfully");
          setIsTeamModalOpen(false);
          fetchTeams();
        } else {
          toast.error(res.data?.msg || "Could not create team");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "An error occurred while saving the team");
    }
  };

  // Delete Team
  const handleDeleteTeam = async (teamId, teamName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the "${teamName}" team?`);
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/admin/teams/${teamId}`);
      if (res.status === 200 && res.data.status === 1) {
        toast.success(res.data.msg || "Team deleted successfully");
        fetchTeams();
        if (selectedTeam?._id === teamId) {
          setIsMemberModalOpen(false);
        }
      } else {
        toast.error(res.data?.msg || "Failed to delete team");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting team");
    }
  };

  // Open Manage Members Modal
  const handleOpenMembersModal = (team) => {
    setSelectedTeam(team);
    setMemberFormData({
      userId: '',
      designation: `${team.department} Executive`,
      accessLevel: 'member'
    });
    setIsMemberModalOpen(true);
  };

  // Add Member to Selected Team
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    if (!memberFormData.userId) {
      toast.warning("Please choose a user to add");
      return;
    }

    try {
      setIsAddingMember(true);
      const res = await axios.post(`/admin/teams/${selectedTeam._id}/members`, memberFormData);
      if (res.status === 200 && res.data.status === 1) {
        toast.success(res.data.msg || "Member added successfully");
        setSelectedTeam(res.data.team);
        setMemberFormData({
          userId: '',
          designation: `${selectedTeam.department} Specialist`,
          accessLevel: 'member'
        });
        fetchTeams();
      } else {
        toast.error(res.data?.msg || "Could not add member");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error adding member");
    } finally {
      setIsAddingMember(false);
    }
  };

  // Remove Member from Selected Team
  const handleRemoveMember = async (memberId, memberName) => {
    if (!selectedTeam) return;
    const confirmRemove = window.confirm(`Remove "${memberName}" from ${selectedTeam.name}?`);
    if (!confirmRemove) return;

    try {
      const res = await axios.delete(`/admin/teams/${selectedTeam._id}/members/${memberId}`);
      if (res.status === 200 && res.data.status === 1) {
        toast.success(res.data.msg || "Member removed from team");
        setSelectedTeam(res.data.team);
        fetchTeams();
      } else {
        toast.error(res.data?.msg || "Failed to remove member");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing member");
    }
  };

  // Total members across all teams
  const totalAssignedMembers = teams.reduce((acc, t) => acc + (t.members?.length || 0), 0);
  const uniqueDepartments = Array.from(new Set(teams.map(t => t.department))).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-amber-500/10 text-[#D97706] dark:text-[#F59E0B] border border-amber-500/25">
                  Internal Governance
                </span>
                <span className="text-xs text-theme-muted">• Organization Access Control</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-theme-main flex items-center gap-2.5">
                <Users className="w-6 h-6 text-[#F59E0B]" />
                <span>Team & Access Control</span>
              </h1>
              <p className="text-xs text-theme-muted max-w-2xl">
                Create departmental organizational units (such as HR, Finance, Operations, Legal) and assign users with custom designations and permission privileges.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenCreateModal}
                className="w-full md:w-auto bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Department Team</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Super Admin Status Banner */}
        <div className="p-3.5 rounded-2xl bg-theme-page border border-theme-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Crown className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span className="text-theme-main font-medium">
              {isSuperAdmin ? (
                <>
                  <strong className="text-[#D97706] dark:text-[#F59E0B]">Super Admin Privileges Active:</strong> You have full authority to create teams, adjust departmental scopes, and assign or revoke user memberships.
                </>
              ) : (
                <>
                  <strong className="text-theme-main">Admin View Mode:</strong> Department teams can be audited below. Creating teams or modifying member assignments requires Super Admin role.
                </>
              )}
            </span>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#F59E0B]/15 text-[#D97706] dark:text-[#F59E0B] border border-[#F59E0B]/25 shrink-0 hidden sm:inline-block">
            {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-theme-muted block">Active Teams</span>
            <div className="text-2xl font-black text-theme-main">{teams.length}</div>
            <span className="text-[10px] text-theme-muted">Departmental units</span>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-theme-muted block">Assigned Members</span>
            <div className="text-2xl font-black text-[#D97706] dark:text-[#F59E0B]">{totalAssignedMembers}</div>
            <span className="text-[10px] text-theme-muted">Active memberships</span>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-theme-muted block">Departments</span>
            <div className="text-2xl font-black text-theme-main">{uniqueDepartments}</div>
            <span className="text-[10px] text-theme-muted">Business functions</span>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-theme-muted block">Available Users</span>
            <div className="text-2xl font-black text-theme-main">{platformUsers.length}</div>
            <span className="text-[10px] text-theme-muted">Platform accounts</span>
          </div>
        </div>

        {/* Teams Grid / Overview Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-64 rounded-3xl bg-theme-card border border-theme-border animate-pulse p-6"></div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-theme-card border border-theme-border rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-theme-page text-[#F59E0B] flex items-center justify-center mx-auto border border-theme-border">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-theme-main">No Department Teams Configured</h3>
              <p className="text-xs text-theme-muted max-w-sm mx-auto mt-1">
                Create teams like Human Resources (HR), Finance & Accounts, or Operations to organize team access and permissions.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Team</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {teams.map((team) => {
              const memberCount = team.members?.length || 0;

              return (
                <div
                  key={team._id}
                  className="bg-theme-card border border-theme-border hover:border-[#F59E0B]/50 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Card Header: Department Tag & Action Buttons */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/10 text-[#D97706] dark:text-[#F59E0B] border border-amber-500/25">
                        {team.department}
                      </span>

                      <div className="flex items-center gap-1.5 opacity-90">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(team)}
                          className="p-1.5 rounded-lg text-theme-muted hover:text-theme-main hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                          title="Edit Team"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeam(team._id, team.name)}
                          className="p-1.5 rounded-lg text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete Team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Team Name & Description */}
                    <div>
                      <h3 className="font-extrabold text-base text-theme-main group-hover:text-[#F59E0B] transition">
                        {team.name}
                      </h3>
                      <p className="text-xs text-theme-muted mt-1 leading-relaxed line-clamp-2">
                        {team.description || "Internal departmental team for organizational access and operations."}
                      </p>
                    </div>

                    {/* Members Preview Avatar Strip */}
                    <div className="pt-2 border-t border-theme-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {team.members && team.members.length > 0 ? (
                            team.members.slice(0, 4).map((m, mIdx) => (
                              <div
                                key={mIdx}
                                className="w-7 h-7 rounded-full bg-[#1A1008] text-[#F59E0B] border-2 border-theme-card font-bold text-[10px] flex items-center justify-center uppercase shadow-xs"
                                title={`${m.name} (${m.designation})`}
                              >
                                {m.name ? m.name[0] : 'U'}
                              </div>
                            ))
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-theme-page text-theme-muted border border-theme-border font-medium text-[10px] flex items-center justify-center">
                              0
                            </div>
                          )}
                        </div>
                        {memberCount > 4 && (
                          <span className="text-[10px] font-bold text-theme-muted">
                            +{memberCount - 4} more
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold text-theme-main">
                        {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMembersModal(team)}
                      className="w-full py-2.5 px-3 rounded-xl bg-theme-page hover:bg-[#F59E0B] text-theme-main hover:text-slate-950 font-bold text-xs transition border border-theme-border hover:border-transparent flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Manage Team Members ({memberCount})</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ==================== 1. MANAGE MEMBERS MODAL ==================== */}
      <AnimatePresence>
        {isMemberModalOpen && selectedTeam && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center font-poppins">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMemberModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto text-theme-main"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-[#D97706] dark:text-[#F59E0B] border border-amber-500/25">
                      {selectedTeam.department} Team
                    </span>
                    <span className="text-xs text-theme-muted">• {selectedTeam.members?.length || 0} Members</span>
                  </div>
                  <h3 className="text-lg font-black text-theme-main mt-0.5">
                    {selectedTeam.name}
                  </h3>
                </div>
                <button
                  onClick={() => setIsMemberModalOpen(false)}
                  className="p-1.5 text-theme-muted hover:text-theme-main rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add User Section (Super Admin Only) */}
              <div className="p-4 rounded-2xl bg-theme-page border border-theme-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-theme-main flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-[#F59E0B]" />
                    <span>Add User to this Team</span>
                  </h4>
                  <span className="text-[10px] text-theme-muted">Select from active registered users</span>
                </div>

                <form onSubmit={handleAddMember} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    
                    {/* User Selection */}
                    <div className="sm:col-span-6">
                      <label className="text-[11px] font-semibold text-theme-muted block mb-1">
                        Select Platform User *
                      </label>
                      <select
                        required
                        value={memberFormData.userId}
                        onChange={(e) => setMemberFormData({ ...memberFormData, userId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-card text-theme-main focus:outline-hidden focus:border-[#F59E0B] cursor-pointer"
                      >
                        <option value="">-- Choose User --</option>
                        {platformUsers
                          .filter(u => !selectedTeam.members?.some(m => String(m.user) === String(u._id) || m.email === u.email))
                          .map(u => (
                            <option key={u._id} value={u._id}>
                              {u.name} ({u.email}) — [{u.role}]
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Designation */}
                    <div className="sm:col-span-6">
                      <label className="text-[11px] font-semibold text-theme-muted block mb-1">
                        Team Designation / Title
                      </label>
                      <input
                        type="text"
                        value={memberFormData.designation}
                        onChange={(e) => setMemberFormData({ ...memberFormData, designation: e.target.value })}
                        placeholder="e.g. Lead, Executive, Analyst"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-card text-theme-main focus:outline-hidden focus:border-[#F59E0B]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isAddingMember}
                      className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingMember ? "Adding..." : "Add User to Team"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Members List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-theme-main">Current Team Members:</span>
                  <span className="text-theme-muted">{selectedTeam.members?.length || 0} enrolled</span>
                </div>

                {(!selectedTeam.members || selectedTeam.members.length === 0) ? (
                  <div className="py-8 text-center text-xs text-theme-muted border border-dashed border-theme-border rounded-2xl">
                    No users have been assigned to this team yet. Use the form above to add members.
                  </div>
                ) : (
                  <div className="divide-y divide-theme-border border border-theme-border rounded-2xl overflow-hidden bg-theme-card">
                    {selectedTeam.members.map((member) => (
                      <div
                        key={member._id}
                        className="p-3.5 flex items-center justify-between gap-3 hover:bg-black/2 dark:hover:bg-white/2 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#1A1008] text-[#F59E0B] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs uppercase">
                            {member.name ? member.name[0] : 'U'}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs sm:text-sm text-theme-main truncate">
                              {member.name}
                            </h5>
                            <div className="flex items-center gap-2 text-[11px] text-theme-muted">
                              <span>{member.email}</span>
                              <span>•</span>
                              <span className="font-semibold text-[#D97706] dark:text-[#F59E0B]">
                                {member.designation || 'Team Member'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-theme-page text-theme-muted border border-theme-border hidden sm:inline-block">
                            Added {new Date(member.addedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member._id, member.name)}
                            className="p-1.5 rounded-lg text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Remove Member from Team"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== 2. CREATE / EDIT TEAM MODAL ==================== */}
      <AnimatePresence>
        {isTeamModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center font-poppins">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTeamModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-4 text-theme-main"
            >
              <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                <h3 className="font-black text-base sm:text-lg text-theme-main">
                  {isEditingTeam ? "Edit Department Team" : "Create New Department Team"}
                </h3>
                <button
                  onClick={() => setIsTeamModalOpen(false)}
                  className="p-1.5 text-theme-muted hover:text-theme-main rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Template Presets */}
              {!isEditingTeam && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
                    Quick Preset Templates (Click to fill):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLoadPreset("Human Resources (HR)", "HR", "Manages staff onboarding, talent acquisition, and employee record oversight.")}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-theme-page hover:bg-amber-500/10 hover:text-[#F59E0B] border border-theme-border transition cursor-pointer"
                    >
                      + HR Team
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadPreset("Finance & Accounts", "Finance", "Manages escrow accounting, settlement reconciliations, GST compliance, and audit logs.")}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-theme-page hover:bg-amber-500/10 hover:text-[#F59E0B] border border-theme-border transition cursor-pointer"
                    >
                      + Finance Team
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadPreset("Operations & Supply Chain", "Operations", "Supervises courier dispatch, inventory audits, and supplier fulfillment SLAs.")}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-theme-page hover:bg-amber-500/10 hover:text-[#F59E0B] border border-theme-border transition cursor-pointer"
                    >
                      + Operations Team
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadPreset("Legal & Compliance", "Legal", "Ensures merchant GST verification, seller contracts, and marketplace regulatory safety.")}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-theme-page hover:bg-amber-500/10 hover:text-[#F59E0B] border border-theme-border transition cursor-pointer"
                    >
                      + Legal Team
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitTeam} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-theme-main">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamFormData.name}
                    onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                    placeholder="e.g. Human Resources (HR) or Finance & Accounts"
                    className="w-full px-3.5 py-2.5 bg-theme-page border border-theme-border rounded-xl text-theme-main focus:outline-hidden focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-theme-main">
                    Department Category *
                  </label>
                  <select
                    value={teamFormData.department}
                    onChange={(e) => setTeamFormData({ ...teamFormData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-theme-page border border-theme-border rounded-xl text-theme-main focus:outline-hidden focus:border-[#F59E0B] cursor-pointer"
                  >
                    <option value="HR">Human Resources (HR)</option>
                    <option value="Finance">Finance & Accounts</option>
                    <option value="Operations">Operations & Logistics</option>
                    <option value="Legal">Legal & Compliance</option>
                    <option value="Marketing">Growth & Marketing</option>
                    <option value="Support">Customer Support</option>
                    <option value="IT">IT & Engineering</option>
                    <option value="Executive">Executive Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-theme-main">
                    Description & Mission Scope
                  </label>
                  <textarea
                    rows="3"
                    value={teamFormData.description}
                    onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                    placeholder="Briefly describe what this department team is responsible for..."
                    className="w-full px-3.5 py-2 bg-theme-page border border-theme-border rounded-xl text-theme-main focus:outline-hidden focus:border-[#F59E0B]"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-border">
                  <button
                    type="button"
                    onClick={() => setIsTeamModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-theme-border text-theme-muted hover:text-theme-main transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold transition cursor-pointer shadow-xs"
                  >
                    {isEditingTeam ? "Save Changes" : "Create Team"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};
