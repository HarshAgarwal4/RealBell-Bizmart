import mongoose from "mongoose";
import { hashPassword } from "../../services/encryption.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin', 'super_admin'],
        default: 'user'
    },
    phone: {
        type: String,
        default: ""
    },
    profile: {
        type: String,
        default: "/defaultProfile.png"
    },
    companyName: {
        type: String,
        default: ""
    },
    gstin: {
        type: String,
        default: ""
    },
    businessType: {
        type: String,
        default: "Individual"
    },
    address: {
        addressLine: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        country: { type: String, default: "India" }
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    // Seller Approval Workflow fields
    sellerStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    sellerDetails: {
        shopName: { type: String, default: "" },
        gstNumber: { type: String, default: "" },
        businessCategory: { type: String, default: "" },
        phone: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        bankAccount: { type: String, default: "" },
        ifscCode: { type: String, default: "" },
        upiId: { type: String, default: "" },
        idProofUrl: { type: String, default: "" },
        appliedAt: { type: Date },
        approvedAt: { type: Date },
        rejectionReason: { type: String, default: "" }
    },
    sessions: [
        {
            token: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    let r = await hashPassword(this.password);
    this.password = r;
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;