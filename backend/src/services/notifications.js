import 'dotenv/config';


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
async function sendEmailAlert(orderId, customerName) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.GMAIL_USER; // This must be the email you verified in Brevo!
    const adminEmail = process.env.ADMIN_EMAILS; // The email receiving the alerts
    
    if (!apiKey || !senderEmail || !adminEmail) {
        throw new Error("Missing Brevo API Key or email environment variables");
    }

    const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #0a1f44;">New Order Alert 🚨</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Order Ref:</strong> ${orderId}</p>
            <p><em>This order is pending pricing.</em></p>
            <br/>
            <a href="https://treshblinkyfits.vercel.app/admin/admin" style="display: inline-block; padding: 10px 20px; background-color: #b2ede4; color: #0a1f44; text-decoration: none; border-radius: 5px; font-weight: bold;">Set Price in Dashboard</a>
        </div>
    `;

    // Using Brevo's HTTP API instead of SMTP to bypass cloud port blocking
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: { name: 'TBF Orders', email: senderEmail },
            to: [{ email: adminEmail }], // Sends to yourself!
            subject: `New Order Received: ${orderId}`,
            htmlContent: htmlBody
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
    }
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
    const results = await Promise.allSettled([emailTask, discordTask]);

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
