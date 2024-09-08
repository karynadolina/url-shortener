import express from 'express';
import routes from './routes';
import dbPromise from './database';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

dbPromise.then(db => {
    db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_id TEXT NOT NULL UNIQUE
    )
  `);
}).catch(err => {
    console.error('Failed to initialize database', err);
});

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
