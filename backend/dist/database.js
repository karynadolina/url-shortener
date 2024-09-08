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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const pg_1 = require("pg");
const db = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db.connect().then(() => {
                console.log('Connected to PostgreSQL database');
            })
                .catch((err) => {
                console.error('Error connecting to database:', err);
                process.exit(1);
            });
            yield db.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_id TEXT NOT NULL UNIQUE
      );
    `);
            console.log('Table "urls" created or already exists');
        }
        catch (error) {
            console.error('Failed to connect to database or create table', error);
            throw error;
        }
    });
}
exports.default = db;
