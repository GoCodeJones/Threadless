import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDatabase } from '../config/database';
import { ConnectionModel, UserModel } from '../models';

export class FeedController {
  async getFeed(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const db = await getDatabase();
      const connectionModel = new ConnectionModel(db);
      const userModel = new UserModel(db);

      // Buscar IDs das conexões
      const connections = await connectionModel.findByUserId(userId);
      const connectionIds = connections.map(conn => 
        conn.user_id_1 === userId ? conn.user_id_2 : conn.user_id_1
      );

      // Adicionar o próprio usuário para ver seus posts
      connectionIds.push(userId);

      // Buscar posts das conexões + promoted posts
      const placeholders = connectionIds.map(() => '?').join(',');
      
      const posts = await db.all(
        `SELECT p.*, u.username, u.trust_score, u.is_admin 
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE (p.user_id IN (${placeholders}) AND p.visibility IN ('public', 'connections'))
            OR p.is_promoted = 1
         ORDER BY p.is_promoted DESC, p.created_at DESC
         LIMIT ? OFFSET ?`,
        [...connectionIds, limit, offset]
      );

      // Adicionar contagem de comentários
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          const comments = await db.get(
            'SELECT COUNT(*) as count FROM comments WHERE post_id = ?',
            [post.id]
          );
          
          return {
            id: post.id,
            content: post.content,
            visibility: post.visibility,
            isPromoted: post.is_promoted === 1,
            createdAt: post.created_at,
            author: {
              id: post.user_id,
              username: post.username,
              trustScore: post.trust_score,
              isAdmin: post.is_admin === 1
            },
            commentsCount: comments.count
          };
        })
      );

      return res.status(200).json({
        feed: postsWithComments,
        count: postsWithComments.length,
        limit,
        offset,
        hasMore: postsWithComments.length === limit
      });
    } catch (error) {
      console.error('Get feed error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPublicFeed(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const db = await getDatabase();

      // Apenas posts públicos + promoted
      const posts = await db.all(
        `SELECT p.*, u.username, u.trust_score, u.is_admin 
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.visibility = 'public' OR p.is_promoted = 1
         ORDER BY p.is_promoted DESC, p.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          const comments = await db.get(
            'SELECT COUNT(*) as count FROM comments WHERE post_id = ?',
            [post.id]
          );
          
          return {
            id: post.id,
            content: post.content,
            visibility: post.visibility,
            isPromoted: post.is_promoted === 1,
            createdAt: post.created_at,
            author: {
              id: post.user_id,
              username: post.username,
              trustScore: post.trust_score,
              isAdmin: post.is_admin === 1
            },
            commentsCount: comments.count
          };
        })
      );

      return res.status(200).json({
        feed: postsWithComments,
        count: postsWithComments.length,
        limit,
        offset,
        hasMore: postsWithComments.length === limit
      });
    } catch (error) {
      console.error('Get public feed error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}