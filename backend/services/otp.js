import { sendMail } from "./mail.js";

let otpStorage = new Map()

function genereateOTP() {
    return Math.floor(100000 + Math.random()*900000)
}

async function sendOtp(email) {
    if(!email) return false
    const otp = genereateOTP()
    if(otpStorage.has(email)) otpStorage.delete(email)
    otpStorage.set(email , otp)
    setTimeout(() => {
        otpStorage.delete(email)
    }, 5*60*1000);
    try {
        let r = await sendMail(email, "RealBell BizMart - Password Verification OTP", `<h2>Your Verification OTP for RealBell BizMart is <span style="color:#f59e0b;font-weight:bold;">${otp}</span></h2><p>This OTP is valid for 5 minutes for authentication. Please do not share it with anyone.</p><br><p>Best regards,<br>RealBell BizMart Security Team</p>`)
        if(!r) return false
        else return true
    }catch(err){
        console.log(err)
        return false
    }
}

async function verifyOtp(email , otp) {
    if(!email || !otp) return false
    if(!otpStorage.has(email)) return false
    let storedOTP = otpStorage.get(email)
    if(String(storedOTP) !== String(otp)) return false
    otpStorage.delete(email)
    return true
}

export {sendOtp , verifyOtp}