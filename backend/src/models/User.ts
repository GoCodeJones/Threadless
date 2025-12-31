import { Database } from 'sqlite';
import bcrypt from 'bcrypt';
import { User } from '../types';
import { generateMasterPassword } from '../utils/passwordGenerator';

export class UserModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(username: string, password: string, isAdmin: boolean = false): Promise<User> {
    const masterPassword = generateMasterPassword(16);
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '10'));

    const result = await this.db.run(
      `INSERT INTO users (username, password_hash, master_password, is_admin, trust_score) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, passwordHash, masterPassword, isAdmin ? 1 : 0, isAdmin ? 100 : 0]
    );

    return {
      id: result.lastID,
      username,
      password_hash: passwordHash,
      master_password: masterPassword,
      trust_score: isAdmin ? 100 : 0,
      is_admin: isAdmin
    };
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async updateTrustScore(userId: number, score: number): Promise<void> {
    await this.db.run('UPDATE users SET trust_score = ? WHERE id = ?', [score, userId]);
  }

  async updateProfile(userId: number, profileData: string): Promise<void> {
    await this.db.run(
      'UPDATE users SET profile_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [profileData, userId]
    );
  }
}