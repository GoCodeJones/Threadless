const db = require("../db");

// insere um post fixo (apenas se não existir)
function seedPost() {
  const exists = db
    .prepare('SELECT 1 FROM posts WHERE slug = ?')
    .get('post-genesis');

  if (!exists) {
    db.prepare(`
      INSERT INTO posts (id, slug, title, content, published_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'post-genesis',
      'post-genesis',
      'Post Genesis',
      `This is the first post of Threadless, the decentralized blogger.

We live in an era where privacy is still treated as suspicious. Where owning your data is radical. Where speaking without permission from platforms is revolutionary.

But it doesn't have to be this way.

The web was built on open protocols. HTTP. RSS. Simple standards that anyone could implement. No gatekeepers. No algorithms deciding what you see. No companies owning your network.

Threadless returns to these principles. Each blog is independent. Connections are explicit. Trust is earned, not assigned by a central authority.

This isn't about building another platform. It's about remembering what the web was supposed to be: a network of individuals, not a handful of corporations controlling speech.

Own your words. Choose your connections. Build your network.`,
      new Date().toISOString()
    );
  }
}

function getAllPosts() {
  return db
    .prepare(
      "SELECT slug, title, content, published_at FROM posts ORDER BY published_at DESC"
    )
    .all();
}

function getPostBySlug(slug) {
  return db
    .prepare(
      "SELECT slug, title, content, published_at FROM posts WHERE slug = ?"
    )
    .get(slug);
}

module.exports = {
  seedPost,
  getAllPosts,
  getPostBySlug,
};
