import { Database } from 'sqlite';
import { Post } from '../types';

export class PostModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(userId: number, content: string, visibility: string = 'connections', isPromoted: boolean = false): Promise<Post> {
    const result = await this.db.run(
      `INSERT INTO posts (user_id, content, visibility, is_promoted) 
       VALUES (?, ?, ?, ?)`,
      [userId, content, visibility, isPromoted ? 1 : 0]
    );

    return {
      id: result.lastID,
      user_id: userId,
      content,
      visibility: visibility as 'public' | 'connections' | 'private',
      is_promoted: isPromoted
    };
  }

  async findById(id: number): Promise<Post | undefined> {
    return await this.db.get('SELECT * FROM posts WHERE id = ?', [id]);
  }

  async findByUserId(userId: number): Promise<Post[]> {
    return await this.db.all(
      'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  async findAll(limit: number = 50): Promise<Post[]> {
    return await this.db.all(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.run('DELETE FROM posts WHERE id = ?', [id]);
  }

  async update(id: number, content: string): Promise<void> {
    await this.db.run(
      'UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content, id]
    );
  }
}