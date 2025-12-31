import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDatabase } from '../config/database';
import { CommentModel, PostModel, ConnectionModel, UserModel } from '../models';
import { TrustService } from '../services/trustService';

export class CommentController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { postId, content } = req.body;
      const userId = req.user!.id;

      if (!postId || !content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Post ID and content are required' });
      }

      const db = await getDatabase();
      const postModel = new PostModel(db);
      const connectionModel = new ConnectionModel(db);
      const commentModel = new CommentModel(db);

      // Verificar se o post existe
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Verificar permissões
      if (post.visibility === 'private' && post.user_id !== userId) {
        return res.status(403).json({ error: 'Cannot comment on private posts' });
      }

      if (post.visibility === 'connections' && post.user_id !== userId) {
        const areConnected = await connectionModel.areConnected(userId, post.user_id);
        if (!areConnected) {
          return res.status(403).json({ error: 'You must be connected to comment on this post' });
        }
      }

      // Criar comentário
      const comment = await commentModel.create(postId, userId, content);

      // Atualizar trust score do autor do post (recebeu interação)
      const trustService = new TrustService(db);
      await trustService.updateUserTrustScore(post.user_id);

      return res.status(201).json({
        message: 'Comment created successfully',
        comment
      });
    } catch (error) {
      console.error('Create comment error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByPostId(req: AuthRequest, res: Response) {
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user!.id;

      const db = await getDatabase();
      const postModel = new PostModel(db);
      const connectionModel = new ConnectionModel(db);
      const commentModel = new CommentModel(db);
      const userModel = new UserModel(db);

      // Verificar se o post existe
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Verificar permissões
      if (post.visibility === 'private' && post.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      if (post.visibility === 'connections' && post.user_id !== userId) {
        const areConnected = await connectionModel.areConnected(userId, post.user_id);
        if (!areConnected) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Buscar comentários
      const comments = await commentModel.findByPostId(postId);

      // Adicionar dados do usuário em cada comentário
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await userModel.findById(comment.user_id);
          return {
            ...comment,
            user: {
              id: user?.id,
              username: user?.username,
              trustScore: user?.trust_score
            }
          };
        })
      );

      return res.status(200).json({
        comments: commentsWithUsers,
        count: commentsWithUsers.length
      });
    } catch (error) {
      console.error('Get comments error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const commentId = parseInt(req.params.id);
      const userId = req.user!.id;

      const db = await getDatabase();
      const commentModel = new CommentModel(db);

      // Buscar comentário
      const comment = await db.get('SELECT * FROM comments WHERE id = ?', [commentId]);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Verificar permissões (apenas o autor ou admin pode deletar)
      if (comment.user_id !== userId && !req.user!.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await commentModel.delete(commentId);

      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}