import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.myGMAIL,
        pass: process.env.password
    }
});

// Generate professional RealBell BizMart branded HTML template
export const generateBrandedEmailHtml = ({
    title = 'Official Communication',
    message = '',
    actionText = '',
    actionUrl = '',
    senderName = 'RealBell Administrator',
    senderRole = 'Executive Operations',
    recipientName = 'Valued Member'
}) => {
    const formattedMessage = (message || '')
        .split('\n')
        .filter(p => p.trim())
        .map(p => `<p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.6; color: #374151;">${p}</p>`)
        .join('');

    const ctaButton = (actionText && actionUrl) ? `
        <div style="margin: 28px 0; text-align: center;">
            <a href="${actionUrl}" style="background-color: #F59E0B; color: #020617; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);">
                ${actionText} &rarr;
            </a>
        </div>
    ` : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 24px 12px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                    
                    <!-- Header Strip -->
                    <tr>
                        <td style="background-color: #172033; padding: 22px 28px; border-bottom: 3px solid #F59E0B;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <span style="color: #F59E0B; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">RealBell <span style="color: #FFFFFF;">BizMart</span></span>
                                        <div style="color: #94A3B8; font-size: 11px; margin-top: 2px; text-transform: uppercase; letter-spacing: 1px;">Official Platform Communication</div>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; padding: 4px 10px; background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
                                            Verified Transmission
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px 28px;">
                            <div style="font-size: 12px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                                Attention: ${recipientName}
                            </div>
                            
                            <h1 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 800; color: #0F172A; line-height: 1.4;">
                                ${title}
                            </h1>

                            <div style="border-left: 3px solid #F59E0B; padding-left: 14px; margin-bottom: 20px;">
                                ${formattedMessage}
                            </div>

                            ${ctaButton}

                            <!-- Sender Sign-off -->
                            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                                <p style="margin: 0; font-size: 12px; color: #64748B;">Dispatched by:</p>
                                <p style="margin: 2px 0 0 0; font-size: 14px; font-weight: 700; color: #0F172A;">${senderName}</p>
                                <p style="margin: 0; font-size: 11px; color: #F59E0B; font-weight: 600;">${senderRole} &bull; RealBell BizMart</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 20px 28px; border-top: 1px solid #E2E8F0; text-align: center;">
                            <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                                This electronic message was dispatched by an authorized administrator through RealBell BizMart Enterprise Governance.
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #94A3B8;">
                                &copy; ${new Date().getFullYear()} RealBell BizMart. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};

async function sendMail(to, subject, text, options = {}) {
    if (!process.env.myGMAIL || !process.env.password) {
        console.log(`=================================================`);
        console.log(`[Email Simulation / Dev Mode] Gmail credentials not set in .env.`);
        console.log(`[Email Simulation] To: ${Array.isArray(to) ? to.join(', ') : to}`);
        console.log(`[Email Simulation] Subject: ${subject}`);
        console.log(`=================================================`);
        return true;
    }

    const mailOptions = {
        from: options.from || `"RealBell BizMart" <${process.env.myGMAIL}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        html: text,
        bcc: options.bcc || undefined
    };

    try {
        let r = await transporter.sendMail(mailOptions);
        return !!r;
    } catch (err) {
        console.error("Nodemailer error:", err.message);
        // If email failed in local dev, allow flow to proceed rather than blocking
        return false;
    }
}

export { sendMail };