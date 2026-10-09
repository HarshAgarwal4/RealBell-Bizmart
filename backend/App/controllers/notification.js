import NotificationModel from "../models/notification.js";
import userModel from "../models/user.js";
import TeamModel from "../models/team.js";

// Helper: Check if requesting user is Super Admin, Admin, or an active Team Member
export const isUserAuthorizedSender = async (user) => {
    if (!user) return false;
    if (['admin', 'super_admin'].includes(user.role)) return true;

    // Check if user is an assigned member in any active team
    const teamMembership = await TeamModel.findOne({
        "members.user": user._id,
        isActive: true
    });

    return !!teamMembership;
};

// 1. Dispatch Notification (Specific user, Entire Team, Entire Group, or All)
export const sendNotification = async (req, res) => {
    try {
        const canSend = await isUserAuthorizedSender(req.user);
        if (!canSend) {
            return res.status(403).json({
                status: 0,
                msg: "Access denied. Only Super Admins, Admins, or assigned Team Members can dispatch notifications."
            });
        }

        const {
            targetType,    // 'specific' | 'team' | 'group' | 'all'
            targetId,      // userId, teamId, or group identifier ('buyers', 'sellers', 'admins')
            targetUserIds, // optional array of specific user IDs
            title,
            message,
            type = 'info', // 'info' | 'warning' | 'success' | 'urgent' | 'announcement' | 'system'
            priority = 'normal', // 'normal' | 'high' | 'urgent'
            link = ''
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ status: 0, msg: "Notification title is required." });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ status: 0, msg: "Notification message content is required." });
        }

        let recipients = [];
        let computedTargetName = "";

        // Resolve recipients based on targetType
        if (targetType === 'specific') {
            const userIds = Array.isArray(targetUserIds) && targetUserIds.length > 0 
                ? targetUserIds 
                : (targetId ? [targetId] : []);

            if (userIds.length === 0) {
                return res.status(400).json({ status: 0, msg: "Please select at least one specific recipient." });
            }

            recipients = await userModel.find({ _id: { $in: userIds } }).select('_id name email role');
            if (recipients.length === 0) {
                return res.status(404).json({ status: 0, msg: "Selected recipient user(s) could not be found." });
            }

            computedTargetName = recipients.length === 1 
                ? `${recipients[0].name} (${recipients[0].email})` 
                : `${recipients.length} Selected Members`;

        } else if (targetType === 'team') {
            if (!targetId) {
                return res.status(400).json({ status: 0, msg: "Please specify a target Team ID." });
            }

            const team = await TeamModel.findById(targetId);
            if (!team) {
                return res.status(404).json({ status: 0, msg: "Target team was not found." });
            }

            const memberUserIds = team.members.map(m => m.user);
            if (memberUserIds.length === 0) {
                return res.status(400).json({ status: 0, msg: `The team '${team.name}' has no assigned members yet.` });
            }

            recipients = await userModel.find({ _id: { $in: memberUserIds } }).select('_id name email role');
            computedTargetName = `${team.name} Team (${team.department})`;

        } else if (targetType === 'group') {
            const groupKey = (targetId || '').toLowerCase();
            
            if (groupKey === 'buyers' || groupKey === 'buyer' || groupKey === 'user') {
                recipients = await userModel.find({ role: 'user' }).select('_id name email role');
                computedTargetName = "Whole Group: All Buyers & Normal Users";
            } else if (groupKey === 'sellers' || groupKey === 'seller') {
                recipients = await userModel.find({ role: 'seller' }).select('_id name email role');
                computedTargetName = "Whole Group: All Verified Merchants & Sellers";
            } else if (groupKey === 'admins' || groupKey === 'admin') {
                recipients = await userModel.find({ role: { $in: ['admin', 'super_admin'] } }).select('_id name email role');
                computedTargetName = "Whole Group: All Administrative Personnel";
            } else {
                return res.status(400).json({ 
                    status: 0, 
                    msg: "Invalid group specified. Valid groups: 'buyers', 'sellers', 'admins'." 
                });
            }

        } else if (targetType === 'all') {
            recipients = await userModel.find({}).select('_id name email role');
            computedTargetName = "Platform-Wide Broadcast: All Registered Users";

        } else {
            return res.status(400).json({ 
                status: 0, 
                msg: "Invalid targetType. Choose from 'specific', 'team', 'group', or 'all'." 
            });
        }

        if (recipients.length === 0) {
            return res.status(404).json({ 
                status: 0, 
                msg: "No registered accounts matched the recipient criteria." 
            });
        }

        // Generate unique broadcast grouping ID
        const broadcastId = `bc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        // Determine sender display role
        let senderRoleLabel = "Admin";
        if (req.user.role === 'super_admin') {
            senderRoleLabel = "Super Admin";
        } else if (req.user.role === 'admin') {
            senderRoleLabel = "System Admin";
        } else {
            // Find team designation if team member
            const memberTeam = await TeamModel.findOne({ "members.user": req.user._id, isActive: true });
            if (memberTeam) {
                const memberData = memberTeam.members.find(m => m.user.toString() === req.user._id.toString());
                senderRoleLabel = memberData?.designation ? `${memberTeam.department} • ${memberData.designation}` : `${memberTeam.department} Member`;
            } else {
                senderRoleLabel = "Staff Member";
            }
        }

        const now = new Date();
        const notificationDocs = recipients.map(recipient => ({
            title: title.trim(),
            message: message.trim(),
            type,
            priority,
            sender: req.user._id,
            senderName: req.user.name || "Administrator",
            senderEmail: req.user.email || "",
            senderRole: senderRoleLabel,
            recipient: recipient._id,
            recipientName: recipient.name || "User",
            recipientEmail: recipient.email || "",
            recipientRole: recipient.role || "user",
            targetType,
            targetName: computedTargetName,
            broadcastId,
            link: (link || '').trim(),
            isRead: false,
            readAt: null,
            createdAt: now
        }));

        await NotificationModel.insertMany(notificationDocs);

        return res.status(201).json({
            status: 1,
            msg: `Notification successfully dispatched to ${recipients.length} recipient${recipients.length === 1 ? '' : 's'}.`,
            count: recipients.length,
            broadcastId,
            targetName: computedTargetName
        });

    } catch (error) {
        console.error("Error dispatching notification:", error);
        return res.status(500).json({ status: 0, msg: "Failed to dispatch notification: " + error.message });
    }
};

// 2. Get Current Logged-in User's Notifications
export const getMyNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: 0, msg: "Unauthorized. Please login." });
        }

        const { limit = 50, page = 1, unreadOnly = 'false' } = req.query;
        const query = { recipient: req.user._id };

        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [notifications, totalCount, unreadCount] = await Promise.all([
            NotificationModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            NotificationModel.countDocuments(query),
            NotificationModel.countDocuments({ recipient: req.user._id, isRead: false })
        ]);

        return res.json({
            status: 1,
            notifications,
            totalCount,
            unreadCount,
            page: parseInt(page),
            pages: Math.ceil(totalCount / parseInt(limit))
        });

    } catch (error) {
        console.error("Error retrieving user notifications:", error);
        return res.status(500).json({ status: 0, msg: "Failed to fetch notifications: " + error.message });
    }
};

// 3. Mark Single Notification as Read
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await NotificationModel.findOneAndUpdate(
            { _id: id, recipient: req.user._id },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ status: 0, msg: "Notification not found or access denied." });
        }

        const unreadCount = await NotificationModel.countDocuments({ recipient: req.user._id, isRead: false });

        return res.json({
            status: 1,
            msg: "Notification marked as read.",
            notification: updated,
            unreadCount
        });

    } catch (error) {
        return res.status(500).json({ status: 0, msg: error.message });
    }
};

// 4. Mark All Notifications as Read for User
export const markAllNotificationsRead = async (req, res) => {
    try {
        await NotificationModel.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        return res.json({
            status: 1,
            msg: "All notifications marked as read.",
            unreadCount: 0
        });

    } catch (error) {
        return res.status(500).json({ status: 0, msg: error.message });
    }
};

// 5. Delete / Dismiss a Notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await NotificationModel.findOneAndDelete({
            _id: id,
            recipient: req.user._id
        });

        if (!deleted) {
            return res.status(404).json({ status: 0, msg: "Notification not found." });
        }

        const unreadCount = await NotificationModel.countDocuments({ recipient: req.user._id, isRead: false });

        return res.json({
            status: 1,
            msg: "Notification dismissed successfully.",
            unreadCount
        });

    } catch (error) {
        return res.status(500).json({ status: 0, msg: error.message });
    }
};

// 6. Get Broadcast History (For Admin & Team Members)
export const getBroadcastHistory = async (req, res) => {
    try {
        const canAccess = await isUserAuthorizedSender(req.user);
        if (!canAccess) {
            return res.status(403).json({ status: 0, msg: "Access denied." });
        }

        // Group sent notifications by broadcastId to aggregate stats
        const broadcasts = await NotificationModel.aggregate([
            {
                $match: {
                    broadcastId: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$broadcastId",
                    title: { $first: "$title" },
                    message: { $first: "$message" },
                    type: { $first: "$type" },
                    priority: { $first: "$priority" },
                    targetType: { $first: "$targetType" },
                    targetName: { $first: "$targetName" },
                    sender: { $first: "$sender" },
                    senderName: { $first: "$senderName" },
                    senderRole: { $first: "$senderRole" },
                    createdAt: { $first: "$createdAt" },
                    link: { $first: "$link" },
                    totalRecipients: { $sum: 1 },
                    readCount: {
                        $sum: { $cond: ["$isRead", 1, 0] }
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 60 }
        ]);

        return res.json({
            status: 1,
            broadcasts
        });

    } catch (error) {
        console.error("Error fetching broadcast history:", error);
        return res.status(500).json({ status: 0, msg: error.message });
    }
};

// 7. Get Directory for Recipient Selection (Teams, Groups & Platform Users)
export const getRecipientsDirectory = async (req, res) => {
    try {
        const canAccess = await isUserAuthorizedSender(req.user);
        if (!canAccess) {
            return res.status(403).json({ status: 0, msg: "Access denied." });
        }

        const [teams, users] = await Promise.all([
            TeamModel.find({ isActive: true }).select('name department description members color'),
            userModel.find({}).select('name email role profile sellerStatus companyName')
        ]);

        const counts = {
            buyers: users.filter(u => u.role === 'user').length,
            sellers: users.filter(u => u.role === 'seller').length,
            admins: users.filter(u => ['admin', 'super_admin'].includes(u.role)).length,
            total: users.length
        };

        return res.json({
            status: 1,
            teams,
            users,
            counts
        });

    } catch (error) {
        return res.status(500).json({ status: 0, msg: error.message });
    }
};
