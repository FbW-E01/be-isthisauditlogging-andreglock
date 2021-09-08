import express from 'express';
import { JSONFile, Low } from 'lowdb';

const app = express();

const adapter = new JSONFile('./db.json');
const db = new Low(adapter);

async function logAccess (request) {
    await db.read();
    db.data = db.data || { entries: [] };
    const timeNow = new Date;
    db.data.entries.push(`[${timeNow.toISOString()}], ${request.method} ${request.originalUrl} accessed`);
    db.write();
}

app.get('/secret', (req, res) => {
    logAccess(req);
    setTimeout(() => {
        res.send('Gotten\n');
    }, (Math.random()*4000 + 1000))
});

app.get('/disclosed', (req, res) => {
    logAccess(req);
    setTimeout(() => {
        res.send('Gotten\n');
    }, (Math.random()*4000 + 1000))
});

app.post('/secret', (req, res) => {
    logAccess(req);
    setTimeout(() => {
        res.send('Posted\n');
    }, (Math.random()*4000 + 1000))
});

app.post('/disclosed', (req, res) => {
    logAccess(req);
    setTimeout(() => {
        res.send('Posted\n');
    }, (Math.random()*4000 + 1000))
});

app.get('/listEntries', async (req, res) => {
    await db.read();
    if (!db.data) {
        res.send('No entries found.');
    }
    res.send(db.data.entries);
})

app.listen(3000);


