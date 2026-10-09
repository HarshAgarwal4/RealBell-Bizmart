import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    actionText: {
        type: String,
        default: ""
    },
    actionUrl: {
        type: String,
        default: ""
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
    targetType: {
        type: String,
        enum: ['specific', 'team', 'group', 'all'],
        default: 'specific'
    },
    targetName: {
        type: String,
        default: ""
    },
    recipientCount: {
        type: Number,
        default: 0
    },
    recipientEmails: [{
        type: String
    }],
    deliveryStatus: {
        type: String,
        enum: ['sent', 'simulated', 'failed'],
        default: 'sent'
    },
    sentAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const EmailLogModel = mongoose.model("EmailLog", emailLogSchema);

export default EmailLogModel;
