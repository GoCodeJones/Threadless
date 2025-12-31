import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDatabase } from '../config/database';
import { ConnectionModel, UserModel } from '../models';

export class ConnectionController {
  async generateKey(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const db = await getDatabase();
      const connectionModel = new ConnectionModel(db);

      const connectionKey = await connectionModel.createConnectionKey(userId);

      return res.status(201).json({
        message: 'Connection key generated successfully',
        connectionKey,
        expiresIn: '24h',
        instructions: 'Share this key with someone to connect with them'
      });
    } catch (error) {
      console.error('Generate key error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async connectWithKey(req: AuthRequest, res: Response) {
    try {
      const { connectionKey } = req.body;
      const userId = req.user!.id;

      if (!connectionKey) {
        return res.status(400).json({ error: 'Connection key is required' });
      }

      const db = await getDatabase();
      const connectionModel = new ConnectionModel(db);
      const userModel = new UserModel(db);

      const connection = await connectionModel.connectWithKey(userId, connectionKey);

      if (!connection) {
        return res.status(400).json({ 
          error: 'Invalid connection key or you cannot connect with yourself' 
        });
      }

      // Buscar dados do usuário conectado
      const connectedUser = await userModel.findById(connection.user_id_1);

      return res.status(200).json({
        message: 'Connected successfully',
        connection: {
          id: connection.id,
          connectedWith: {
            id: connectedUser?.id,
            username: connectedUser?.username,
            trustScore: connectedUser?.trust_score
          },
          createdAt: connection.created_at
        }
      });
    } catch (error) {
      console.error('Connect with key error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMyConnections(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const db = await getDatabase();
      const connectionModel = new ConnectionModel(db);
      const userModel = new UserModel(db);

      const connections = await connectionModel.findByUserId(userId);

      // Buscar dados dos usuários conectados
      const connectionsWithUsers = await Promise.all(
        connections.map(async (conn) => {
          const otherUserId = conn.user_id_1 === userId ? conn.user_id_2 : conn.user_id_1;
          const otherUser = await userModel.findById(otherUserId);
          
          return {
            id: conn.id,
            user: {
              id: otherUser?.id,
              username: otherUser?.username,
              trustScore: otherUser?.trust_score
            },
            createdAt: conn.created_at
          };
        })
      );

      return res.status(200).json({
        connections: connectionsWithUsers,
        count: connectionsWithUsers.length
      });
    } catch (error) {
      console.error('Get connections error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkConnection(req: AuthRequest, res: Response) {
    try {
      const targetUserId = parseInt(req.params.userId);
      const userId = req.user!.id;

      if (userId === targetUserId) {
        return res.status(400).json({ error: 'Cannot check connection with yourself' });
      }

      const db = await getDatabase();
      const connectionModel = new ConnectionModel(db);

      const areConnected = await connectionModel.areConnected(userId, targetUserId);

      return res.status(200).json({ connected: areConnected });
    } catch (error) {
      console.error('Check connection error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}