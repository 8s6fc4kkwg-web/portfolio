const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'newsletter.db');
const db = new sqlite3.Database(dbPath);

const targetEmail = 'pro.theopetit@gmail.com';

db.serialize(() => {
    db.run(`DELETE FROM subscribers WHERE email != ?`, [targetEmail], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Deleted ${this.changes} subscribers.`);
    });

    db.all(`SELECT * FROM subscribers`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log('Remaining subscribers:', rows);
    });
});

db.close();
