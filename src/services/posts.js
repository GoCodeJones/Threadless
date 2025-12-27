const db = require('../db');

// insere um post fixo (apenas se não existir)
function seedPost() {
  const exists = db
    .prepare('SELECT 1 FROM posts WHERE slug = ?')
    .get('primeiro-post');

  if (!exists) {
    db.prepare(`
      INSERT INTO posts (id, slug, title, content, published_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'post-1',
      'primeiro-post',
      'Primeiro Post',
      'Olá. Este é o primeiro post do Threadless.',
      new Date().toISOString()
    );
  }
}

function getAllPosts() {
  return db
    .prepare('SELECT slug, title, content, published_at FROM posts ORDER BY published_at DESC')
    .all();
}

function getPostBySlug(slug) {
  return db
    .prepare(
      'SELECT slug, title, content, published_at FROM posts WHERE slug = ?'
    )
    .get(slug);
}


module.exports = {
  seedPost,
  getAllPosts,
  getPostBySlug
};

