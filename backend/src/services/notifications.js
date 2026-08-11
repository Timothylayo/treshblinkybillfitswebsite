import 'dotenv/config';
import nodemailer from 'nodemailer'


/**
 * 1. DISCORD WEBHOOK
 */
async function sendDiscordWebhook(orderId, customerName) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) throw new Error("Discord Webhook URL is missing");

    const payload = {
        content: `🚨 **New Order Alert!**\n**Order ID:** ${orderId}\n**Customer:** ${customerName}\n**`
    };

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Discord API responded with status: ${response.status}`);
    }
}

// Create the reusable Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
    }
});

async function sendEmailAlert(orderId, customerName) {
    const mailOptions = {
        from: `"TBF Orders" <${process.env.GMAIL_USER}>`,
        to: process.env.ADMIN_EMAILS || process.env.GMAIL_USER, // Sends to yourself!
        subject: `New Order Received: ${orderId}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #0a1f44;">New Order Alert 🚨</h2>
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Order Ref:</strong> ${orderId}</p>
                <p><em>This order is pending pricing.</em></p>
                <br/>
                <a href="https://treshblinkybillfits.vercel.app/admin/admin" style="display: inline-block; padding: 10px 20px; background-color: #b2ede4; color: #0a1f44; text-decoration: none; border-radius: 5px; font-weight: bold;">Set Price in Dashboard</a>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}

/**
 * MASTER DISPATCH CONTROLLER
 * Fires all three notifications concurrently.
 */
export async function dispatchOrderAlerts(orderId, customerName) {
    console.log(`Dispatching alert infrastructure for Order: ${orderId}...`);

    // Initialize all network requests simultaneously
    const emailTask = sendEmailAlert(orderId, customerName);
    const discordTask = sendDiscordWebhook(orderId, customerName);

    // Wait for all to finish, whether they succeed or fail
    const results = await Promise.allSettled([emailTask, discordTask, whatsappTask]);

    // Check results and log specific failures without crashing the backend
    const services = ['Email', 'Discord'];
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`❌ ${services[index]} alert failed:`, result.reason.message);
        } else {
            console.log(`✅ ${services[index]} alert sent successfully.`);
        }
    });
}
