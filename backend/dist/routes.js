"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shortid_1 = __importDefault(require("shortid"));
const database_1 = __importDefault(require("./database"));
const cors_1 = __importDefault(require("cors"));
const router = express_1.default.Router();
router.use((0, cors_1.default)());
router.use(express_1.default.json());
router.post('/api/shorten', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5002';
    const urlPattern = new RegExp('^(https?:\\/\\/)' +
        '([\\da-z.-]+)\\.([a-z.]{2,6})' +
        '(\\/.*)?$', 'i');
    if (!url || !urlPattern.test(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    try {
        const existing = yield database_1.default.query('SELECT * FROM urls WHERE original_url = $1', [url]);
        if (existing.rows.length > 0) {
            return res.json({ shortUrl: `${baseUrl}/${existing.rows[0].short_id}` });
        }
        const shortId = shortid_1.default.generate();
        yield database_1.default.query('INSERT INTO urls (original_url, short_id) VALUES ($1, $2)', [url, shortId]);
        res.json({ shortUrl: `${baseUrl}/${shortId}` });
    }
    catch (error) {
        console.error('Error inserting or selecting URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.get('/:shortId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortId } = req.params;
    try {
        const record = yield database_1.default.query('SELECT original_url FROM urls WHERE short_id = $1', [shortId]);
        if (record.rows.length > 0) {
            res.json({ original_url: record.rows[0].original_url });
        }
        else {
            res.status(404).send('Not found');
        }
    }
    catch (error) {
        console.error('Error retrieving original URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
