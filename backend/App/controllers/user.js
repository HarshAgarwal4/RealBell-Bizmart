import { setUser } from "../../services/Auth.js";
import { verifyPassword } from "../../services/encryption.js";
import { sendOtp, verifyOtp } from "../../services/otp.js";
import UserModel from "../models/user.js";

async function signUp(req, res) {
    let { name, email, password, otp, role } = req.body;
    if (!email || !name || !password || !otp) {
        return res.send({ status: 7, msg: "Invalid fields" });
    }
    // Only 'user' or 'seller' can be selected on signup (admin cannot self-register)
    const validRole = role === 'seller' ? 'seller' : 'user';
    const sellerStatus = validRole === 'seller' ? 'none' : 'none';

    let obj = {
        name,
        email,
        password,
        role: validRole,
        sellerStatus
    };

    try {
        let isOTPmatched = await verifyOtp(email, otp);
        if (!isOTPmatched) return res.send({ status: 10, msg: "Invalid or expired OTP" });
        let user = new UserModel(obj);
        let token = await setUser(user._id);
        if (!token) return res.send({ status: 11, msg: "Error generating token" });
        user.sessions = [{ token }];
        res.cookie('UID', token, {
            httpOnly: process.env.production === 'true',
            secure: process.env.production === 'true',
            sameSite: process.env.production === 'true' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        await user.save();
        return res.send({ status: 1, msg: "User registered successfully", user });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Internal server error" });
    }
}

async function login(req, res) {
    let { email, password } = req.body;
    if (!email || !password) return res.send({ status: 7, msg: "Invalid fields" });
    try {
        let findUser = await UserModel.findOne({ email });
        if (!findUser) return res.send({ status: 9, msg: "No user found with this email" });
        let hashedPassword = findUser.password;
        let r = await verifyPassword(password, hashedPassword);
        if (!r) return res.send({ status: 10, msg: "Invalid email or password" });
        
        let token = await setUser(findUser._id);
        if (!token) return res.send({ status: 11, msg: "Error generating token" });
        findUser.sessions = [{ token }];
        res.cookie('UID', token, {
            httpOnly: process.env.production === 'true',
            secure: process.env.production === 'true',
            sameSite: process.env.production === 'true' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        await findUser.save();
        return res.send({ status: 1, msg: "Login successful", user: findUser });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Internal server error" });
    }
}

async function sendOTPToEmail(req, res) {
    let { email } = req.body;
    if (!email) return res.send({ status: 7, msg: "Invalid fields" });
    try {
        let r = await sendOtp(email);
        if (!r) return res.send({ status: 8, msg: "Error in generating OTP" });
        return res.send({ status: 1, msg: "OTP sent successfully" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Internal server error" });
    }
}

async function resetPassword(req, res) {
    let { email, otp, newPassword, password } = req.body;
    let pwd = newPassword || password;
    if (!email || !otp || !pwd) {
        return res.send({ status: 7, msg: "Email, OTP and new password are required" });
    }
    try {
        let isOTPmatched = await verifyOtp(email, otp);
        if (!isOTPmatched) {
            return res.send({ status: 10, msg: "Invalid or expired OTP" });
        }
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.send({ status: 9, msg: "No account found with this email" });
        }
        user.password = pwd;
        await user.save();
        return res.send({ status: 1, msg: "Password reset successfully" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Internal server error" });
    }
}

async function fetchUser(req, res) {
    try {
        if (req.user) return res.send({ status: 1, user: req.user });
        return res.send({ status: 0, msg: "No user found" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "No user found" });
    }
}

async function logout(req, res) {
    try {
        let token = req.cookies?.UID;
        res.clearCookie('UID', {
            httpOnly: process.env.production === 'true',
            secure: process.env.production === 'true',
            sameSite: process.env.production === 'true' ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        if (req.user) {
            req.user.sessions = req.user.sessions.filter((session) => session.token !== token);
            await req.user.save();
            req.user = null;
        }
        return res.send({ status: 1, msg: "Logged out successfully" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Server error" });
    }
}

// Seller: Submit Approval Form
async function applySeller(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Please login to apply as seller" });
        const {
            shopName,
            gstNumber,
            businessCategory,
            phone,
            address,
            city,
            state,
            pincode,
            bankAccount,
            ifscCode,
            upiId
        } = req.body;

        if (!shopName || !businessCategory || !phone || !address) {
            return res.send({ status: 7, msg: "Please fill all required business fields" });
        }

        req.user.role = 'seller';
        req.user.sellerStatus = 'pending';
        req.user.sellerDetails = {
            shopName,
            gstNumber: gstNumber || "",
            businessCategory,
            phone,
            address,
            city: city || "",
            state: state || "",
            pincode: pincode || "",
            bankAccount: bankAccount || "",
            ifscCode: ifscCode || "",
            upiId: upiId || "",
            appliedAt: new Date(),
            rejectionReason: ""
        };

        await req.user.save();
        return res.send({
            status: 1,
            msg: "Application submitted successfully! Your account is currently under admin review.",
            user: req.user
        });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to submit seller application" });
    }
}

// Admin: Get all seller applications
async function adminGetSellers(req, res) {
    try {
        const { status } = req.query;
        let query = {
            $or: [
                { role: 'seller' },
                { sellerStatus: { $in: ['pending', 'approved', 'rejected'] } }
            ]
        };
        if (status && status !== 'all') {
            query.sellerStatus = status;
        }
        const sellers = await UserModel.find(query).sort({ "sellerDetails.appliedAt": -1, createdAt: -1 });
        return res.send({ status: 1, sellers });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to fetch seller applications" });
    }
}

// Admin: Approve Seller
async function adminApproveSeller(req, res) {
    try {
        const { userId } = req.body;
        if (!userId) return res.send({ status: 7, msg: "User ID is required" });
        const seller = await UserModel.findById(userId);
        if (!seller) return res.send({ status: 9, msg: "Seller user not found" });

        seller.role = 'seller';
        seller.sellerStatus = 'approved';
        if (!seller.sellerDetails) seller.sellerDetails = {};
        seller.sellerDetails.approvedAt = new Date();
        seller.sellerDetails.rejectionReason = "";
        await seller.save();

        return res.send({ status: 1, msg: `Seller ${seller.name} has been approved successfully!`, seller });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to approve seller" });
    }
}

// Admin: Reject Seller
async function adminRejectSeller(req, res) {
    try {
        const { userId, reason } = req.body;
        if (!userId) return res.send({ status: 7, msg: "User ID is required" });
        const seller = await UserModel.findById(userId);
        if (!seller) return res.send({ status: 9, msg: "Seller user not found" });

        seller.sellerStatus = 'rejected';
        if (!seller.sellerDetails) seller.sellerDetails = {};
        seller.sellerDetails.rejectionReason = reason || "Application did not meet marketplace compliance standards.";
        await seller.save();

        return res.send({ status: 1, msg: `Seller ${seller.name} application has been rejected.`, seller });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to reject seller" });
    }
}

// Admin: Get All Users
async function adminGetUsers(req, res) {
    try {
        const users = await UserModel.find().sort({ createdAt: -1 });
        return res.send({ status: 1, users });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to fetch users" });
    }
}

// Admin: Update User Role
async function adminUpdateRole(req, res) {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) return res.send({ status: 7, msg: "User ID and Role are required" });
        if (!['user', 'seller', 'admin', 'super_admin'].includes(role)) {
            return res.send({ status: 7, msg: "Invalid role specified" });
        }
        const user = await UserModel.findById(userId);
        if (!user) return res.send({ status: 9, msg: "User not found" });

        user.role = role;
        if (role === 'seller' && user.sellerStatus === 'none') {
            user.sellerStatus = 'approved';
        }
        await user.save();
        return res.send({ status: 1, msg: `Updated ${user.name}'s role to ${role}`, user });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Failed to update user role" });
    }
}

export {
    signUp,
    login,
    sendOTPToEmail,
    resetPassword,
    fetchUser,
    logout,
    applySeller,
    adminGetSellers,
    adminApproveSeller,
    adminRejectSeller,
    adminGetUsers,
    adminUpdateRole
};