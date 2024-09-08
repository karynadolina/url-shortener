import { Client } from 'pg';

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function connectToDatabase() {
  try {
    await db.connect().then(() => {
        console.log('Connected to PostgreSQL database');
      })
      .catch((err) => {
        console.error('Error connecting to database:', err);
        process.exit(1);
      });

    await db.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_id TEXT NOT NULL UNIQUE
      );
    `);
    console.log('Table "urls" created or already exists');
  } catch (error) {
    console.error('Failed to connect to database or create table', error);
    throw error;
  }
}

export default db;
