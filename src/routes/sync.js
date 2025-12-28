const express = require('express');
const router = express.Router();
const connectionsService = require('../services/connections');
const remotePostsService = require('../services/remotePosts');
const { fetchFeed } = require('../utils/fetchFeed');
const { verifySignature } = require('../utils/signature');

router.post('/sync', async (req, res) => {
  const connections = connectionsService.getAllConnections();

  let synced = 0;
  let failed = 0;

  for (const connection of connections) {
    try {
      const feed = await fetchFeed(connection.feed);

      const { signature, posts, ...payload } = feed;

      if (!signature) {
        throw new Error('Missing signature');
      }

      // segredo compartilhado (MVP)
      const secret = connection.secret || process.env.BLOG_SECRET;

      if (!verifySignature(payload, signature, secret)) {
        throw new Error('Invalid signature');
      }

      if (!Array.isArray(posts)) {
        throw new Error('Invalid feed format');
      }

      for (const post of posts) {
        remotePostsService.saveRemotePost(
          {
            id: `${connection.id}:${post.slug}`,
            slug: post.slug,
            title: post.title,
            content: post.content,
            published_at: post.published_at
          },
          connection.id
        );
      }

      synced++;
    } catch (err) {
      failed++;
      console.error(`Erro ao sincronizar ${connection.feed}:`, err.message);
    }
  }

  res.json({
    success: true,
    total: connections.length,
    synced,
    failed
  });
});

module.exports = router;
