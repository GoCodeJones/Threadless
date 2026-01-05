import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDatabase } from '../config/database';
import { UserModel, PostModel } from '../models';

export class AdminController {
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const db = await getDatabase();

      // Estatísticas gerais
      const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
      const totalPosts = await db.get('SELECT COUNT(*) as count FROM posts');
      const totalConnections = await db.get('SELECT COUNT(*) as count FROM connections WHERE status = ?', ['active']);
      const totalComments = await db.get('SELECT COUNT(*) as count FROM comments');

      return res.status(200).json({
        stats: {
          totalUsers: totalUsers.count,
          totalPosts: totalPosts.count,
          totalConnections: totalConnections.count,
          totalComments: totalComments.count
        }
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const db = await getDatabase();
      const users = await db.all(
        'SELECT id, username, trust_score, is_admin, created_at FROM users ORDER BY created_at DESC'
      );

      return res.status(200).json({ users });
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllPosts(req: AuthRequest, res: Response) {
    try {
      const db = await getDatabase();
      const posts = await db.all(
        `SELECT p.*, u.username, u.is_admin 
         FROM posts p
         JOIN users u ON p.user_id = u.id
         ORDER BY p.created_at DESC`
      );

      return res.status(200).json({ posts });
    } catch (error) {
      console.error('Get all posts error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const db = await getDatabase();
      const postModel = new PostModel(db);

      await postModel.delete(postId);

      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}