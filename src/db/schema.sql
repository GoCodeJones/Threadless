CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  content TEXT,
  published_at TEXT
);

CREATE TABLE IF NOT EXISTS connections (
  id TEXT PRIMARY KEY,
  name TEXT,
  site TEXT,
  feed TEXT
);

CREATE TABLE IF NOT EXISTS remote_posts (
  id TEXT PRIMARY KEY,
  connection_id TEXT,
  slug TEXT,
  title TEXT,
  content TEXT,
  published_at TEXT
);
