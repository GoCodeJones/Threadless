import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDatabase } from '../config/database';
import { TrustService } from '../services/trustService';
import { UserModel } from '../models';

export class TrustController {
  async getMyTrustScore(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const db = await getDatabase();
      const trustService = new TrustService(db);

      const calculation = await trustService.calculateTrustScore(userId);

      return res.status(200).json({
        trustScore: calculation.total,
        badge: calculation.badge,
        badgeEmoji: calculation.badgeEmoji,
        breakdown: {
          profileCompletion: `${calculation.profileCompletion}/20`,
          postsActivity: `${calculation.postsActivity}/30`,
          interactionQuality: `${calculation.interactionQuality}/30`,
          accountAge: `${calculation.accountAge}/10`,
          connectionsCount: `${calculation.connectionsCount}/10`
        }
      });
    } catch (error) {
      console.error('Get trust score error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserTrustScore(req: AuthRequest, res: Response) {
    try {
      const targetUserId = parseInt(req.params.userId);

      const db = await getDatabase();
      const userModel = new UserModel(db);
      const trustService = new TrustService(db);

      const user = await userModel.findById(targetUserId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const calculation = await trustService.calculateTrustScore(targetUserId);

      return res.status(200).json({
        user: {
          id: user.id,
          username: user.username
        },
        trustScore: calculation.total,
        badge: calculation.badge,
        badgeEmoji: calculation.badgeEmoji
      });
    } catch (error) {
      console.error('Get user trust score error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateMyTrustScore(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const db = await getDatabase();
      const trustService = new TrustService(db);

      const newScore = await trustService.updateUserTrustScore(userId);

      return res.status(200).json({
        message: 'Trust score updated successfully',
        newScore
      });
    } catch (error) {
      console.error('Update trust score error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async recalculateAll(req: AuthRequest, res: Response) {
    try {
      // Apenas admin pode recalcular todos
      if (!req.user!.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const db = await getDatabase();
      const trustService = new TrustService(db);

      await trustService.recalculateAllTrustScores();

      return res.status(200).json({
        message: 'All trust scores recalculated successfully'
      });
    } catch (error) {
      console.error('Recalculate all error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}