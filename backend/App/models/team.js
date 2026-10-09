import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String, default: "Team Member" }, // e.g. "HR Lead", "Finance Analyst"
    accessLevel: {
        type: String,
        enum: ['lead', 'member', 'viewer'],
        default: 'member'
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: ['HR', 'Finance', 'Operations', 'Legal', 'Marketing', 'Support', 'IT', 'Executive'],
        default: 'Operations'
    },
    description: {
        type: String,
        default: ""
    },
    color: {
        type: String,
        default: "amber"
    },
    members: [teamMemberSchema],
    permissions: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdByName: {
        type: String,
        default: "Super Admin"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const TeamModel = mongoose.model("Team", teamSchema);

export default TeamModel;
