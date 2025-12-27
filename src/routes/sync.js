const express = require('express');
const router = express.Router();
const connectionsService = require('../services/connections');
const remotePostsService = require('../services/remotePosts');
const { fetchFeed } = require('../utils/fetchFeed');

router.post('/sync', async (req, res) => {
  const connections = connectionsService.getAllConnections();

  for (const connection of connections) {
    try {
      const feed = await fetchFeed(connection.feed);

      for (const post of feed.posts) {
        remotePostsService.saveRemotePost(
          {
            ...post,
            id: `${connection.id}:${post.slug}`
          },
          connection.id
        );
      }
    } catch (err) {
      console.error(`Erro ao sincronizar ${connection.feed}`, err.message);
    }
  }

  res.json({ synced: true });
});

module.exports = router;
