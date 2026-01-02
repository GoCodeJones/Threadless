import { Database } from 'sqlite';
import { UserModel, PostModel, ConnectionModel } from '../models';

interface TrustCalculation {
  profileCompletion: number;
  postsActivity: number;
  interactionQuality: number;
  accountAge: number;
  connectionsCount: number;
  total: number;
  badge: string;
  badgeEmoji: string;
}

export class TrustService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  private getBadge(score: number): { name: string; emoji: string } {
    if (score >= 81) return { name: 'Founder', emoji: '🏛️' };
    if (score >= 61) return { name: 'Sovereign', emoji: '🗽' };
    if (score >= 41) return { name: 'Independent', emoji: '💪' };
    if (score >= 21) return { name: 'Free Agent', emoji: '🦅' };
    return { name: 'Newcomer', emoji: '🌱' };
  }

  async calculateTrustScore(userId: number): Promise<TrustCalculation> {
    const userModel = new UserModel(this.db);
    const postModel = new PostModel(this.db);
    const connectionModel = new ConnectionModel(this.db);

    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 1. Profile Completion (max 20 pontos)
    let profileCompletion = 10; // username exists
    if (user.profile_data) {
      const profile = JSON.parse(user.profile_data);
      if (profile.bio) profileCompletion += 5;
      if (profile.avatar) profileCompletion += 5;
    }

    // 2. Posts Activity (max 30 pontos)
    const posts = await postModel.findByUserId(userId);
    const postsActivity = Math.min(posts.length, 30);

    // 3. Interaction Quality (max 30 pontos)
    // Por enquanto baseado em número de comentários recebidos
    const commentsReceived = await this.db.all(
      `SELECT COUNT(*) as count FROM comments 
       WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)`,
      [userId]
    );
    const interactionQuality = Math.min(commentsReceived[0]?.count || 0, 30);

    // 4. Account Age (max 10 pontos)
    const createdAt = new Date(user.created_at!);
    const now = new Date();
    const ageInMs = now.getTime() - createdAt.getTime();
    const monthsOld = Math.max(0, Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 30)));
    const accountAge = Math.min(monthsOld, 10);

    // 5. Connections Count (max 10 pontos)
    const connections = await connectionModel.findByUserId(userId);
    const connectionsCount = Math.min(connections.length, 10);

    // Total
    const total = profileCompletion + postsActivity + interactionQuality + accountAge + connectionsCount;

    // Badge
    const badge = this.getBadge(total);

    return {
      profileCompletion,
      postsActivity,
      interactionQuality,
      accountAge,
      connectionsCount,
      total,
      badge: badge.name,
      badgeEmoji: badge.emoji
    };
  }

  async updateUserTrustScore(userId: number): Promise<number> {
    const calculation = await this.calculateTrustScore(userId);
    const userModel = new UserModel(this.db);
    await userModel.updateTrustScore(userId, calculation.total);
    return calculation.total;
  }

  async recalculateAllTrustScores(): Promise<void> {
    const users = await this.db.all('SELECT id FROM users WHERE is_admin = 0');
    
    for (const user of users) {
      await this.updateUserTrustScore(user.id);
    }

    console.log(`✅ Recalculated trust scores for ${users.length} users`);
  }
}