const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(__dirname, '..', process.env.DATABASE_PATH)
  : path.join(dataDir, 'game.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS saves (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    slot_name TEXT DEFAULT 'AutoSave',
    playtime_seconds INTEGER DEFAULT 0,
    current_location TEXT,
    game_state_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    title TEXT,
    content TEXT NOT NULL,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS deduction_submissions (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    suspect_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    verdict TEXT NOT NULL,
    answers_json TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
