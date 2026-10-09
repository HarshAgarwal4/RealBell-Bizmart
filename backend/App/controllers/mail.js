import EmailLogModel from "../models/emailLog.js";
import userModel from "../models/user.js";
import TeamModel from "../models/team.js";
import { sendMail, generateBrandedEmailHtml } from "../../services/mail.js";
import { isUserAuthorizedSender } from "./notification.js";

// 1. Dispatch Email Broadcast / Direct Mail
export const sendEmailBroadcast = async (req, res) => {
    try {
        const canSend = await isUserAuthorizedSender(req.user);
        if (!canSend) {
            return res.status(403).json({
                status: 0,
                msg: "Access denied. Only Super Admins, Admins, or assigned Team Members can dispatch emails."
            });
        }

        const {
            targetType = 'group', // 'group' | 'team' | 'specific' | 'all' | 'custom'
            targetId,
            customEmail,
            subject,
            message,
            actionText = '',
            actionUrl = ''
        } = req.body;

        if (!subject || !subject.trim()) {
            return res.status(400).json({ status: 0, msg: "Email subject is required." });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ status: 0, msg: "Email body message is required." });
        }

        let recipients = [];
        let computedTargetName = "";

        // Resolve recipients
        if (targetType === 'custom' && customEmail) {
            const clean = customEmail.trim().toLowerCase();
            recipients = [{ email: clean, name: clean.split('@')[0] }];
            computedTargetName = `Direct Email (${clean})`;

        } else if (targetType === 'specific') {
            if (!targetId) {
                return res.status(400).json({ status: 0, msg: "Please select a specific recipient." });
            }
            const foundUser = await userModel.findById(targetId).select('name email role');
            if (!foundUser || !foundUser.email) {
                return res.status(404).json({ status: 0, msg: "Selected recipient does not have a registered email." });
            }
            recipients = [{ email: foundUser.email, name: foundUser.name }];
            computedTargetName = `${foundUser.name} (${foundUser.email})`;

        } else if (targetType === 'team') {
            if (!targetId) {
                return res.status(400).json({ status: 0, msg: "Please select a target team." });
            }
            const team = await TeamModel.findById(targetId);
            if (!team) {
                return res.status(404).json({ status: 0, msg: "Target team was not found." });
            }
            const memberIds = team.members.map(m => m.user);
            const teamUsers = await userModel.find({ _id: { $in: memberIds } }).select('name email');
            recipients = teamUsers.filter(u => u.email).map(u => ({ email: u.email, name: u.name }));
            computedTargetName = `${team.name} Team (${team.department})`;

        } else if (targetType === 'group') {
            const groupKey = (targetId || '').toLowerCase();
            if (groupKey === 'buyers' || groupKey === 'user') {
                const users = await userModel.find({ role: 'user' }).select('name email');
                recipients = users.filter(u => u.email).map(u => ({ email: u.email, name: u.name }));
                computedTargetName = "All Buyers & Normal Users";
            } else if (groupKey === 'sellers' || groupKey === 'seller') {
                const users = await userModel.find({ role: 'seller' }).select('name email');
                recipients = users.filter(u => u.email).map(u => ({ email: u.email, name: u.name }));
                computedTargetName = "All Verified Merchants";
            } else if (groupKey === 'admins' || groupKey === 'admin') {
                const users = await userModel.find({ role: { $in: ['admin', 'super_admin'] } }).select('name email');
                recipients = users.filter(u => u.email).map(u => ({ email: u.email, name: u.name }));
                computedTargetName = "All Administrative Personnel";
            } else {
                return res.status(400).json({ status: 0, msg: "Invalid target group specified." });
            }

        } else if (targetType === 'all') {
            const users = await userModel.find({}).select('name email');
            recipients = users.filter(u => u.email).map(u => ({ email: u.email, name: u.name }));
            computedTargetName = "Platform-Wide: All Registered Users";

        } else {
            return res.status(400).json({ status: 0, msg: "Invalid target type specified." });
        }

        // Deduplicate emails
        const emailMap = new Map();
        for (const r of recipients) {
            if (r.email && !emailMap.has(r.email.toLowerCase())) {
                emailMap.set(r.email.toLowerCase(), r);
            }
        }
        const uniqueRecipients = Array.from(emailMap.values());

        if (uniqueRecipients.length === 0) {
            return res.status(404).json({ status: 0, msg: "No valid recipient email addresses found." });
        }

        // Sender Role Display
        let senderRoleLabel = "System Administrator";
        if (req.user.role === 'super_admin') {
            senderRoleLabel = "Super Admin";
        } else if (req.user.role === 'admin') {
            senderRoleLabel = "Platform Admin";
        } else {
            const memberTeam = await TeamModel.findOne({ "members.user": req.user._id, isActive: true });
            if (memberTeam) {
                const mem = memberTeam.members.find(m => m.user.toString() === req.user._id.toString());
                senderRoleLabel = mem?.designation ? `${memberTeam.department} • ${mem.designation}` : `${memberTeam.department} Member`;
            }
        }

        // Generate email HTML
        const isSimulated = !process.env.myGMAIL || !process.env.password;
        const emailList = uniqueRecipients.map(r => r.email);

        // Dispatch via Nodemailer
        // If single recipient: send personalized; if multiple: send via BCC or batch
        if (uniqueRecipients.length === 1) {
            const single = uniqueRecipients[0];
            const html = generateBrandedEmailHtml({
                title: subject.trim(),
                message: message.trim(),
                actionText: (actionText || '').trim(),
                actionUrl: (actionUrl || '').trim(),
                senderName: req.user.name || "RealBell BizMart Admin",
                senderRole: senderRoleLabel,
                recipientName: single.name || single.email
            });
            await sendMail(single.email, subject.trim(), html);
        } else {
            // Bulk broadcast: send to primary admin with BCC of recipients, or loop
            const html = generateBrandedEmailHtml({
                title: subject.trim(),
                message: message.trim(),
                actionText: (actionText || '').trim(),
                actionUrl: (actionUrl || '').trim(),
                senderName: req.user.name || "RealBell BizMart Admin",
                senderRole: senderRoleLabel,
                recipientName: "Valued Member"
            });

            // Nodemailer batch: send with BCC in chunks of 50
            const chunkSize = 50;
            for (let i = 0; i < emailList.length; i += chunkSize) {
                const chunk = emailList.slice(i, i + chunkSize);
                await sendMail(
                    process.env.myGMAIL || "notifications@realbell.in",
                    subject.trim(),
                    html,
                    { bcc: chunk }
                );
            }
        }

        // Save Email Log in database
        const emailLog = new EmailLogModel({
            subject: subject.trim(),
            message: message.trim(),
            actionText: (actionText || '').trim(),
            actionUrl: (actionUrl || '').trim(),
            sender: req.user._id,
            senderName: req.user.name || "Administrator",
            senderEmail: req.user.email || "",
            senderRole: senderRoleLabel,
            targetType,
            targetName: computedTargetName,
            recipientCount: uniqueRecipients.length,
            recipientEmails: emailList.slice(0, 500),
            deliveryStatus: isSimulated ? 'simulated' : 'sent',
            sentAt: new Date()
        });

        await emailLog.save();

        return res.status(201).json({
            status: 1,
            msg: `Email successfully dispatched to ${uniqueRecipients.length} recipient${uniqueRecipients.length === 1 ? '' : 's'}.`,
            count: uniqueRecipients.length,
            targetName: computedTargetName,
            deliveryStatus: isSimulated ? 'simulated' : 'sent',
            logId: emailLog._id
        });

    } catch (error) {
        console.error("Error sending email broadcast:", error);
        return res.status(500).json({ status: 0, msg: "Failed to dispatch email: " + error.message });
    }
};

// 2. Get Email Campaign Dispatch History
export const getEmailHistory = async (req, res) => {
    try {
        const canAccess = await isUserAuthorizedSender(req.user);
        if (!canAccess) {
            return res.status(403).json({ status: 0, msg: "Access denied." });
        }

        const logs = await EmailLogModel.find({})
            .sort({ sentAt: -1 })
            .limit(60);

        return res.json({
            status: 1,
            logs
        });

    } catch (error) {
        return res.status(500).json({ status: 0, msg: error.message });
    }
};
