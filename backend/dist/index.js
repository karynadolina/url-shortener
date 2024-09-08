"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("./database"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5500;
const corsOptions = {
    origin: ['http://localhost:3001', 'https://url-shortener-sooty-nu-10.vercel.app'],
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
database_1.default.then(db => {
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
app.use(routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
