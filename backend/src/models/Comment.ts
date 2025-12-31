import { Database } from 'sqlite';
import { Comment } from '../types';

export class CommentModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(postId: number, userId: number, content: string): Promise<Comment> {
    const result = await this.db.run(
      `INSERT INTO comments (post_id, user_id, content) 
       VALUES (?, ?, ?)`,
      [postId, userId, content]
    );

    return {
      id: result.lastID,
      post_id: postId,
      user_id: userId,
      content
    };
  }

  async findByPostId(postId: number): Promise<Comment[]> {
    return await this.db.all(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
      [postId]
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.run('DELETE FROM comments WHERE id = ?', [id]);
  }
}