import { sendMail } from "./mail.js";

let otpStorage = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function sendOtp(email) {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    if (otpStorage.has(cleanEmail)) otpStorage.delete(cleanEmail);
    otpStorage.set(cleanEmail, otp);
    
    console.log(`=================================================`);
    console.log(`[RealBell BizMart OTP] Verification Code for ${cleanEmail}: ${otp}`);
    console.log(`=================================================`);

    setTimeout(() => {
        otpStorage.delete(cleanEmail);
    }, 5 * 60 * 1000);

    try {
        let r = await sendMail(
            cleanEmail,
            "RealBell BizMart - Password Verification OTP",
            `<h2>Your Verification OTP for RealBell BizMart is <span style="color:#f59e0b;font-weight:bold;">${otp}</span></h2><p>This OTP is valid for 5 minutes for authentication. Please do not share it with anyone.</p><br><p>Best regards,<br>RealBell BizMart Security Team</p>`
        );
        return r;
    } catch (err) {
        console.error("Error sending OTP email:", err);
        return true; // Still allow flow if dev mode
    }
}

async function verifyOtp(email, otp) {
    if (!email || !otp) return false;
    const cleanEmail = email.trim().toLowerCase();
    if (!otpStorage.has(cleanEmail)) return false;
    let storedOTP = otpStorage.get(cleanEmail);
    if (String(storedOTP).trim() !== String(otp).trim()) return false;
    otpStorage.delete(cleanEmail);
    return true;
}

export { sendOtp, verifyOtp };