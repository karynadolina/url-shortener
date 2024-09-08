import express, { Request, Response } from 'express';
import shortid from 'shortid';
import dbPromise from './database';
import cors from 'cors';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.post('/api/shorten', async (req: Request, res: Response) => {
    const { url } = req.body;

    const baseUrl = process.env.BASE_URL || 'http://localhost:5500';

    const urlPattern = new RegExp('^(https?:\\/\\/)' +
    '([\\da-z.-]+)\\.([a-z.]{2,6})' +
    '(\\/.*)?$', 'i');
  

    if (!url || !urlPattern.test(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const db = await dbPromise;

    const existing = await db.get('SELECT * FROM urls WHERE original_url = ?', url);
    if (existing) {
        return res.json({ shortUrl: `${baseUrl}/${existing.short_id}` });
    }

    const shortId = shortid.generate();

    await db.run('INSERT INTO urls (original_url, short_id) VALUES (?, ?)', url, shortId);

    res.json({ shortUrl: `${baseUrl}/${shortId}` });
});

router.get('/:shortId', async (req: Request, res: Response) => {
    const { shortId } = req.params;

    const db = await dbPromise;
    const record = await db.get('SELECT original_url FROM urls WHERE short_id = ?', shortId);

    if (record) {
        res.redirect(record.original_url);
    } else {
        res.status(404).send('Not found');
    }
});

export default router;
