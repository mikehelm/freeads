import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

const dbPath = path.join(process.cwd(), 'data', 'users.db');

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    wallet TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    nick_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TRIGGER IF NOT EXISTS update_timestamp 
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE wallet = NEW.wallet;
  END;
`);

// Prepare statements for better performance
const statements = {
  getUser: db.prepare('SELECT * FROM users WHERE LOWER(wallet) = LOWER(?)'),
  updateUser: db.prepare(`
    INSERT INTO users (wallet, first_name, last_name, email, nick_name)
    VALUES (@wallet, @first_name, @last_name, @email, @nick_name)
    ON CONFLICT(wallet) DO UPDATE SET
      first_name = @first_name,
      last_name = @last_name,
      email = @email,
      nick_name = @nick_name
  `),
  getAllUsers: db.prepare('SELECT * FROM users'),
};

export function getUser(wallet: string) {
  try {
    return statements.getUser.get(wallet);
  } catch (error) {
    logger.error('Failed to get user', { error, wallet });
    throw error;
  }
}

export function updateUser(user: {
  wallet: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  nick_name?: string;
}) {
  try {
    const result = statements.updateUser.run(user);
    logger.info('User updated', { user, changes: result.changes });
    return getUser(user.wallet);
  } catch (error) {
    logger.error('Failed to update user', { error, user });
    throw error;
  }
}

export function getAllUsers() {
  try {
    return statements.getAllUsers.all();
  } catch (error) {
    logger.error('Failed to get all users', { error });
    throw error;
  }
}

// Import existing CSV data if database is empty
import Papa from 'papaparse';
const csvPath = path.join(process.cwd(), 'public', 'data', 'users', 'user_details.csv');

if (fs.existsSync(csvPath)) {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const { data } = Papa.parse(csvContent, { header: true });
  
  const importStmt = db.prepare(`
    INSERT OR IGNORE INTO users (wallet, first_name, last_name, email, nick_name)
    VALUES (@wallet, @first_name, @last_name, @email, @nick_name)
  `);
  
  const importMany = db.transaction((users: any[]) => {
    for (const user of users) {
      if (user.wallet) {
        importStmt.run(user);
      }
    }
  });
  
  importMany(data);
}

export default db;
