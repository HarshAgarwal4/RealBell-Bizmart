import mongoose from "mongoose";
import TeamModel from "../models/team.js";
import UserModel from "../models/user.js";

// Initial demo teams seed
const defaultTeams = [
    {
        name: "Human Resources (HR)",
        department: "HR",
        description: "Manages employee records, talent recruitment, onboarding, and internal payroll oversight.",
        color: "amber",
        permissions: ["view_employees", "manage_onboarding", "payroll_review"]
    },
    {
        name: "Finance & Accounts",
        department: "Finance",
        description: "Oversees marketplace transactions, Razorpay escrow settlement reconciliations, GST compliance, and audit logs.",
        color: "amber",
        permissions: ["view_escrow", "audit_transactions", "gst_reports", "refund_approvals"]
    },
    {
        name: "Operations & Logistics",
        department: "Operations",
        description: "Supervises courier tracking, wholesale lot dispatch compliance, and merchant fulfillment SLAs.",
        color: "amber",
        permissions: ["track_shipments", "merchant_escalations", "inventory_audits"]
    }
];

// Helper: Check if user is Super Admin
function isSuperAdmin(user) {
    return user && user.role === 'super_admin';
}

// 1. Get all teams with populated member details
async function getAllTeams(req, res) {
    try {
        let teams = await TeamModel.find({ isActive: true }).sort({ createdAt: -1 });

        // Auto-seed initial departmental teams if completely empty
        if (teams.length === 0) {
            const adminUser = req.user || null;
            const seedList = defaultTeams.map(t => ({
                ...t,
                createdBy: adminUser?._id || null,
                createdByName: adminUser?.name || "Super Admin",
                members: []
            }));

            await TeamModel.insertMany(seedList);
            teams = await TeamModel.find({ isActive: true }).sort({ createdAt: -1 });
        }

        return res.send({
            status: 1,
            teams,
            isSuperAdmin: isSuperAdmin(req.user)
        });
    } catch (err) {
        console.error("Fetch teams error:", err);
        return res.send({ status: 0, msg: "Failed to fetch teams: " + err.message });
    }
}

// 2. Create a new team (Super Admin only)
async function createTeam(req, res) {
    try {
        if (!isSuperAdmin(req.user)) {
            return res.send({
                status: 403,
                msg: "Permission denied: Only Super Admin can create new department teams."
            });
        }

        const { name, department, description, permissions } = req.body;

        if (!name || !name.trim()) {
            return res.send({ status: 7, msg: "Team name is required (e.g. HR, Finance, Operations)" });
        }

        // Check if team with same name already exists
        const existing = await TeamModel.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            isActive: true
        });

        if (existing) {
            return res.send({ status: 7, msg: `A team named "${name.trim()}" already exists.` });
        }

        const newTeam = new TeamModel({
            name: name.trim(),
            department: department || "Operations",
            description: description?.trim() || "",
            permissions: Array.isArray(permissions) ? permissions : [],
            createdBy: req.user._id,
            createdByName: req.user.name || "Super Admin",
            members: []
        });

        await newTeam.save();

        return res.send({
            status: 1,
            msg: `Team "${newTeam.name}" created successfully.`,
            team: newTeam
        });
    } catch (err) {
        console.error("Create team error:", err);
        return res.send({ status: 0, msg: "Failed to create team: " + err.message });
    }
}

// 3. Update team details (Super Admin only)
async function updateTeam(req, res) {
    try {
        if (!isSuperAdmin(req.user)) {
            return res.send({ status: 403, msg: "Permission denied: Only Super Admin can modify teams." });
        }

        const { id } = req.params;
        const { name, department, description, permissions } = req.body;

        const team = await TeamModel.findById(id);
        if (!team) return res.send({ status: 9, msg: "Team not found" });

        if (name) team.name = name.trim();
        if (department) team.department = department;
        if (description !== undefined) team.description = description.trim();
        if (Array.isArray(permissions)) team.permissions = permissions;
        team.updatedAt = new Date();

        await team.save();

        return res.send({
            status: 1,
            msg: `Team "${team.name}" updated successfully.`,
            team
        });
    } catch (err) {
        console.error("Update team error:", err);
        return res.send({ status: 0, msg: "Failed to update team" });
    }
}

// 4. Delete team (Super Admin only)
async function deleteTeam(req, res) {
    try {
        if (!isSuperAdmin(req.user)) {
            return res.send({ status: 403, msg: "Permission denied: Only Super Admin can delete teams." });
        }

        const { id } = req.params;
        const team = await TeamModel.findById(id);
        if (!team) return res.send({ status: 9, msg: "Team not found" });

        team.isActive = false;
        await team.save();

        return res.send({
            status: 1,
            msg: `Team "${team.name}" removed successfully.`
        });
    } catch (err) {
        console.error("Delete team error:", err);
        return res.send({ status: 0, msg: "Failed to delete team" });
    }
}

// 5. Add user to a team (Super Admin only)
async function addMemberToTeam(req, res) {
    try {
        if (!isSuperAdmin(req.user)) {
            return res.send({
                status: 403,
                msg: "Permission denied: Only Super Admin can assign users to teams."
            });
        }

        const { id } = req.params; // Team ID
        const { userId, designation, accessLevel } = req.body;

        if (!userId) {
            return res.send({ status: 7, msg: "Please select a user to add to the team" });
        }

        const team = await TeamModel.findById(id);
        if (!team) return res.send({ status: 9, msg: "Team not found" });

        // Verify target user exists
        const targetUser = await UserModel.findById(userId);
        if (!targetUser) return res.send({ status: 9, msg: "Selected user not found in database" });

        // Check if user is already a member of this team
        const alreadyMember = team.members.some(
            m => String(m.user) === String(targetUser._id) || m.email.toLowerCase() === targetUser.email.toLowerCase()
        );

        if (alreadyMember) {
            return res.send({
                status: 7,
                msg: `User "${targetUser.name}" (${targetUser.email}) is already a member of ${team.name}.`
            });
        }

        team.members.push({
            user: targetUser._id,
            name: targetUser.name,
            email: targetUser.email,
            designation: designation?.trim() || `${team.department} Member`,
            accessLevel: accessLevel || "member",
            addedAt: new Date(),
            addedBy: req.user._id
        });

        await team.save();

        return res.send({
            status: 1,
            msg: `"${targetUser.name}" has been added to ${team.name}.`,
            team
        });
    } catch (err) {
        console.error("Add member error:", err);
        return res.send({ status: 0, msg: "Failed to add member to team: " + err.message });
    }
}

// 6. Remove user from team (Super Admin only)
async function removeMemberFromTeam(req, res) {
    try {
        if (!isSuperAdmin(req.user)) {
            return res.send({
                status: 403,
                msg: "Permission denied: Only Super Admin can remove team members."
            });
        }

        const { id, memberId } = req.params; // Team ID and Member _id or User ID

        const team = await TeamModel.findById(id);
        if (!team) return res.send({ status: 9, msg: "Team not found" });

        const initialCount = team.members.length;
        team.members = team.members.filter(
            m => String(m._id) !== String(memberId) && String(m.user) !== String(memberId)
        );

        if (team.members.length === initialCount) {
            return res.send({ status: 9, msg: "Member was not found in this team" });
        }

        await team.save();

        return res.send({
            status: 1,
            msg: `Member removed from ${team.name}.`,
            team
        });
    } catch (err) {
        console.error("Remove member error:", err);
        return res.send({ status: 0, msg: "Failed to remove member" });
    }
}

// 7. Get platform users for quick member selection dropdown
async function getPlatformUsers(req, res) {
    try {
        const { search } = req.query;
        let query = {};

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query = {
                $or: [
                    { name: regex },
                    { email: regex },
                    { phone: regex }
                ]
            };
        }

        const users = await UserModel.find(query)
            .select('_id name email role profile phone isVerified sellerStatus')
            .limit(50)
            .sort({ createdAt: -1 });

        return res.send({ status: 1, users });
    } catch (err) {
        console.error("Fetch platform users error:", err);
        return res.send({ status: 0, msg: "Failed to load platform users" });
    }
}

export {
    getAllTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    getPlatformUsers
};
