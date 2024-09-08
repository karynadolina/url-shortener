import express, { Request, Response } from 'express';
import shortid from 'shortid';
import db from './database';
import cors from 'cors';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.post('/api/shorten', async (req: Request, res: Response) => {
    const { url } = req.body;

    const baseUrl = process.env.BASE_URL || 'http://localhost:5002';

    const urlPattern = new RegExp('^(https?:\\/\\/)' +
        '([\\da-z.-]+)\\.([a-z.]{2,6})' +
        '(\\/.*)?$', 'i');
  
    if (!url || !urlPattern.test(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const existing = await db.query('SELECT * FROM urls WHERE original_url = $1', [url]);
        if (existing.rows.length > 0) {
            return res.json({ shortUrl: `${baseUrl}/${existing.rows[0].short_id}` });
        }

        const shortId = shortid.generate();

        await db.query('INSERT INTO urls (original_url, short_id) VALUES ($1, $2)', [url, shortId]);

        res.json({ shortUrl: `${baseUrl}/${shortId}` });
    } catch (error) {
        console.error('Error inserting or selecting URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:shortId', async (req: Request, res: Response) => {
    const { shortId } = req.params;

    try {
        const record = await db.query('SELECT original_url FROM urls WHERE short_id = $1', [shortId]);

        if (record.rows.length > 0) {
            res.json({ original_url: record.rows[0].original_url });
        } else {
            res.status(404).send('Not found');
        }
    } catch (error) {
        console.error('Error retrieving original URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
