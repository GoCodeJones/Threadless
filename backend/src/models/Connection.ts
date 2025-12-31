import { Database } from 'sqlite';
import { Connection } from '../types';
import { generateConnectionKey } from '../utils/passwordGenerator';

export class ConnectionModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async createConnectionKey(userId: number): Promise<string> {
    const connectionKey = generateConnectionKey();
    
    await this.db.run(
      `INSERT INTO connections (user_id_1, user_id_2, connection_key, status) 
       VALUES (?, ?, ?, ?)`,
      [userId, 0, connectionKey, 'pending']
    );

    return connectionKey;
  }

  async connectWithKey(userId: number, connectionKey: string): Promise<Connection | null> {
    const connection = await this.db.get(
      'SELECT * FROM connections WHERE connection_key = ? AND status = ?',
      [connectionKey, 'pending']
    );

    if (!connection || connection.user_id_1 === userId) {
      return null;
    }

    await this.db.run(
      'UPDATE connections SET user_id_2 = ?, status = ? WHERE connection_key = ?',
      [userId, 'active', connectionKey]
    );

    return (await this.db.get('SELECT * FROM connections WHERE connection_key = ?', [connectionKey])) || null;
  }

  async findByUserId(userId: number): Promise<Connection[]> {
    return await this.db.all(
      `SELECT * FROM connections 
       WHERE (user_id_1 = ? OR user_id_2 = ?) AND status = ?`,
      [userId, userId, 'active']
    );
  }

  async areConnected(userId1: number, userId2: number): Promise<boolean> {
    const connection = await this.db.get(
      `SELECT * FROM connections 
       WHERE ((user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?))
       AND status = ?`,
      [userId1, userId2, userId2, userId1, 'active']
    );

    return !!connection;
  }
}