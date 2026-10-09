import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'urgent', 'announcement', 'order', 'system'],
        default: 'info'
    },
    priority: {
        type: String,
        enum: ['normal', 'high', 'urgent'],
        default: 'normal'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderName: {
        type: String,
        default: "Administrator"
    },
    senderEmail: {
        type: String,
        default: ""
    },
    senderRole: {
        type: String,
        default: "Admin"
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    recipientName: {
        type: String,
        default: ""
    },
    recipientEmail: {
        type: String,
        default: ""
    },
    recipientRole: {
        type: String,
        default: "user"
    },
    targetType: {
        type: String,
        enum: ['specific', 'team', 'group', 'all'],
        default: 'specific'
    },
    targetName: {
        type: String,
        default: ""
    },
    broadcastId: {
        type: String,
        index: true,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: {
        type: Date,
        default: null
    },
    link: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel;
