const db = require('../db');

function saveRemotePost(post, connectionId) {
  const exists = db
    .prepare('SELECT 1 FROM remote_posts WHERE id = ?')
    .get(post.id);

  if (exists) return;

  db.prepare(`
    INSERT INTO remote_posts (id, connection_id, slug, title, content, published_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    post.id,
    connectionId,
    post.slug,
    post.title,
    post.content,
    post.published_at
  );
}

function getAllRemotePosts() {
  return db
    .prepare(`
      SELECT title, content, published_at
      FROM remote_posts
      ORDER BY published_at DESC
    `)
    .all();
}

module.exports = {
  saveRemotePost,
  getAllRemotePosts
};
