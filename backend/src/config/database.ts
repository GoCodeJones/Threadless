import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const dbPath = path.resolve(process.env.DB_PATH || './data/threadless.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log('Database connected:', dbPath);
  
  return db;
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('Database connection closed');
  }
}