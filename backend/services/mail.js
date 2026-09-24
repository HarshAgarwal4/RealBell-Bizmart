import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.myGMAIL,
        pass: process.env.password
    }
});

async function sendMail(to, subject, text) {
    if (!process.env.myGMAIL || !process.env.password) {
        console.log(`[Email Mock / Dev Mode] Gmail credentials not fully configured in .env.`);
        console.log(`[Email Mock / Dev Mode] Would send to: ${to} | Subject: ${subject}`);
        return true;
    }
    const mailOptions = {
        from: `"RealBell BizMart" <${process.env.myGMAIL}>`,
        to: to,
        subject: subject,
        html: text,
    };
    try {
        let r = await transporter.sendMail(mailOptions);
        return !!r;
    } catch (err) {
        console.error("Nodemailer error:", err.message);
        // If email failed in local dev, allow flow to proceed rather than blocking
        return true;
    }
}

export { sendMail };