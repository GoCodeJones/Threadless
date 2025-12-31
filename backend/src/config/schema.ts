import { Database } from 'sqlite';

export async function createTables(db: Database): Promise<void> {
  console.log('📋 Creating database tables...');

  // Tabela de usuários
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      master_password TEXT NOT NULL,
      trust_score INTEGER DEFAULT 0,
      is_admin BOOLEAN DEFAULT 0,
      profile_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de posts
  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      visibility TEXT DEFAULT 'connections',
      is_promoted BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tabela de conexões
  await db.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id_1 INTEGER NOT NULL,
      user_id_2 INTEGER NOT NULL,
      connection_key TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tabela de comentários
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Índices para melhorar performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_connections_users ON connections(user_id_1, user_id_2);
    CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
  `);

  console.log('Tables created successfully!');
}