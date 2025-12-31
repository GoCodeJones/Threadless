import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDatabase } from '../config/database';
import { PostModel, ConnectionModel } from '../models';

export class PostController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { content, visibility = 'connections' } = req.body;
      const userId = req.user!.id;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
      }

      if (!['public', 'connections', 'private'].includes(visibility)) {
        return res.status(400).json({ error: 'Invalid visibility option' });
      }

      const db = await getDatabase();
      const postModel = new PostModel(db);

      // Admin posts são automaticamente promoted
      const isPromoted = req.user!.isAdmin;

      const post = await postModel.create(userId, content, visibility, isPromoted);

      return res.status(201).json({
        message: 'Post created successfully',
        post: {
          ...post,
          promoted: isPromoted
        }
      });
    } catch (error) {
      console.error('Create post error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.id;

      const db = await getDatabase();
      const postModel = new PostModel(db);
      const connectionModel = new ConnectionModel(db);

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

      return res.status(200).json({ post });
    } catch (error) {
      console.error('Get post error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMyPosts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const db = await getDatabase();
      const postModel = new PostModel(db);

      const posts = await postModel.findByUserId(userId);

      return res.status(200).json({ posts, count: posts.length });
    } catch (error) {
      console.error('Get my posts error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const { content } = req.body;
      const userId = req.user!.id;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const db = await getDatabase();
      const postModel = new PostModel(db);

      const post = await postModel.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.user_id !== userId) {
        return res.status(403).json({ error: 'You can only edit your own posts' });
      }

      await postModel.update(postId, content);

      return res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
      console.error('Update post error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.id;

      const db = await getDatabase();
      const postModel = new PostModel(db);

      const post = await postModel.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.user_id !== userId && !req.user!.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await postModel.delete(postId);

      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}