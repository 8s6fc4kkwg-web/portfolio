const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');
const Parser = require('rss-parser'); // RSS Parser
const parser = new Parser();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../')));

// Route for root to serve index.html explicitly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// --- MongoDB Connection ---
// IMPORTANT: Set MONGODB_URI in your environment variables (e.g., Render Dashboard)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://protheopetit_db_user:DuisWbGdxa8oPDD2@cluster0.7bmogti.mongodb.net/portfolio?appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// --- Mongoose Schemas ---

// Subscriber Schema
const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Visitor Counter Schema
const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., 'main_counter'
    count: { type: Number, default: 0 }
});
const Visitor = mongoose.model('Visitor', visitorSchema);

// --- API Endpoints ---

// Subscribe Endpoint
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }

    try {
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        console.log(`Successfully subscribed: ${email}`);
        res.json({ message: 'Successfully subscribed' });
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            return res.status(400).json({ error: 'Email already subscribed' });
        }
        res.status(500).json({ error: err.message });
    }
});

// View Subscribers Endpoint (For Admin/Testing)
app.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Visitor Counter Endpoint
app.get('/api/visitor-count', async (req, res) => {
    try {
        // Find the counter and increment it atomically
        // upsert: true creates it if it doesn't exist
        const updatedVisitor = await Visitor.findOneAndUpdate(
            { name: 'main_counter' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        res.send(updatedVisitor.count.toString());
    } catch (err) {
        console.error('Error updating visitor count:', err);
        res.status(500).send('Error');
    }
});

// --- Email Logic ---

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'newsletter.ia.innovation@gmail.com',
        pass: 'wbgb qxht lmsm jlxg'
    }
});

// RSS News Fetcher
async function fetchAINews() {
    try {
        const feed = await parser.parseURL('https://www.wired.com/feed/tag/ai/latest/rss');
        const topNews = feed.items.slice(0, 3).map(item => {
            return `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <h3 style="margin: 0 0 5px 0; font-size: 16px;">
                    <a href="${item.link}" style="color: #2c3e50; text-decoration: none;">${item.title}</a>
                </h3>
                <p style="margin: 0; color: #666; font-size: 14px;">${item.contentSnippet ? item.contentSnippet.substring(0, 100) + '...' : ''}</p>
            </div>`;
        }).join('');
        return topNews;
    } catch (error) {
        console.error("Error fetching RSS:", error);
        return `
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0;">Actualités IA indisponibles pour le moment.</h3>
            </div>`;
    }
}

// Send Daily Email
async function sendDailyEmail() {
    console.log('Preparing daily email...');
    const newsHtml = await fetchAINews();
    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    const mailOptions = {
        from: '"IA Daily" <newsletter.ia.innovation@gmail.com>',
        subject: `Veille IA du ${date}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background: #5A8FBD; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">Veille IA Quotidienne</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">${date}</p>
                </div>
                
                <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
                    <p>Bonjour ! Voici les actualités marquantes de l'IA aujourd'hui :</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        ${newsHtml}
                    </div>

                    <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
                        Vous recevez cet email car vous êtes inscrit à la newsletter de Théo PETIT.<br>
                        <a href="#" style="color: #5A8FBD;">Se désinscrire</a>
                    </p>
                </div>
            </div>
        `
    };

    try {
        const subscribers = await Subscriber.find();
        if (subscribers.length === 0) {
            console.log("No subscribers found.");
            return;
        }

        console.log(`Found ${subscribers.length} subscribers. Sending emails...`);

        for (const sub of subscribers) {
            mailOptions.to = sub.email;
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${sub.email}: ${info.response}`);
            } catch (error) {
                console.error(`Error sending to ${sub.email}:`, error);
            }
        }
    } catch (err) {
        console.error("Error fetching subscribers for email:", err);
    }
}

// Schedule: Run every day at 8:00 AM (Paris Time)
cron.schedule('0 8 * * *', () => {
    console.log('Running daily task...');
    sendDailyEmail();
}, {
    scheduled: true,
    timezone: "Europe/Paris"
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
