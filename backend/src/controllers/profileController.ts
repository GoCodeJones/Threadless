import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDatabase } from '../config/database';
import { UserModel } from '../models';
import { TrustService } from '../services/trustService';

interface ProfileData {
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
}

export class ProfileController {
  async getMyProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const db = await getDatabase();
      const userModel = new UserModel(db);
      const trustService = new TrustService(db);

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const trustCalculation = await trustService.calculateTrustScore(userId);

      const profileData: ProfileData = user.profile_data 
        ? JSON.parse(user.profile_data) 
        : {};

      return res.status(200).json({
        profile: {
          id: user.id,
          username: user.username,
          bio: profileData.bio || null,
          avatar: profileData.avatar || null,
          website: profileData.website || null,
          location: profileData.location || null,
          trustScore: user.trust_score,
          badge: trustCalculation.badge,
          badgeEmoji: trustCalculation.badgeEmoji,
          isAdmin: Boolean(user.is_admin),
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Get my profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserProfile(req: AuthRequest, res: Response) {
    try {
      const targetUserId = parseInt(req.params.userId);

      const db = await getDatabase();
      const userModel = new UserModel(db);
      const trustService = new TrustService(db);

      const user = await userModel.findById(targetUserId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const trustCalculation = await trustService.calculateTrustScore(targetUserId);

      const profileData: ProfileData = user.profile_data 
        ? JSON.parse(user.profile_data) 
        : {};

      return res.status(200).json({
        profile: {
          id: user.id,
          username: user.username,
          bio: profileData.bio || null,
          avatar: profileData.avatar || null,
          website: profileData.website || null,
          location: profileData.location || null,
          trustScore: user.trust_score,
          badge: trustCalculation.badge,
          badgeEmoji: trustCalculation.badgeEmoji,
          isAdmin: Boolean(user.is_admin),
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { bio, avatar, website, location } = req.body;

      const db = await getDatabase();
      const userModel = new UserModel(db);
      const trustService = new TrustService(db);

      // Buscar perfil atual
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentProfile: ProfileData = user.profile_data 
        ? JSON.parse(user.profile_data) 
        : {};

      // Atualizar apenas campos fornecidos
      const updatedProfile: ProfileData = {
        bio: bio !== undefined ? bio : currentProfile.bio,
        avatar: avatar !== undefined ? avatar : currentProfile.avatar,
        website: website !== undefined ? website : currentProfile.website,
        location: location !== undefined ? location : currentProfile.location
      };

      // Salvar perfil
      await userModel.updateProfile(userId, JSON.stringify(updatedProfile));

      // Atualizar trust score (preencher perfil aumenta score)
      await trustService.updateUserTrustScore(userId);

      return res.status(200).json({
        message: 'Profile updated successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}