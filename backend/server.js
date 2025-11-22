const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');
const Parser = require('rss-parser'); // RSS Parser
const parser = new Parser();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files (Frontend)
// Serve files from the parent directory (where index.html is located)
app.use(express.static(path.join(__dirname, '../')));

// Route for root to serve index.html explicitly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Database Setup
const dbPath = path.resolve(__dirname, 'newsletter.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Subscribe Endpoint
app.post('/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }

    const sql = `INSERT INTO subscribers (email) VALUES (?)`;
    console.log(`Attempting to subscribe: ${email}`); // Log to terminal
    db.run(sql, [email], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already subscribed' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Successfully subscribed', id: this.lastID });
    });
});

// View Subscribers Endpoint (For Admin/Testing)
app.get('/subscribers', (req, res) => {
    db.all(`SELECT * FROM subscribers`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Email Configuration (Mock/Placeholder)
// IMPORTANT: Replace with real SMTP credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
        user: 'newsletter.ia.innovation@gmail.com',
        pass: 'wbgb qxht lmsm jlxg'
    }
});

// --- RSS News Fetcher ---
async function fetchAINews() {
    try {
        // Using Wired AI Feed (or TechCrunch, etc.)
        const feed = await parser.parseURL('https://www.wired.com/feed/tag/ai/latest/rss');

        // Get top 3 items
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
        // Fallback if RSS fails
        return `
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0;">Actualités IA indisponibles pour le moment.</h3>
            </div>`;
    }
}

// --- Email Sending Logic ---
async function sendDailyEmail() {
    console.log('Preparing daily email...');

    const newsHtml = await fetchAINews(); // Fetch real news

    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    const mailOptions = {
        from: '"IA Daily" <newsletter.ia.innovation@gmail.com>', // Sender address
        subject: `Veille IA du ${date}`, // Subject line
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

    // Get all subscribers
    db.all("SELECT email FROM subscribers", [], (err, rows) => {
        if (err) {
            console.error("Error fetching subscribers:", err);
            return;
        }

        rows.forEach(row => {
            mailOptions.to = row.email;
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(`Error sending to ${row.email}:`, error);
                }
                console.log(`Email sent to ${row.email}: ${info.response}`);
            });
        });

        if (rows.length === 0) {
            console.log("No subscribers found in database.");
        } else {
            console.log(`Found ${rows.length} subscribers. Sending emails...`);
        }
    });
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
