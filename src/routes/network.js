const express = require('express');
const router = express.Router();
const remotePostsService = require('../services/remotePosts');

router.get('/network', (req, res) => {
  const posts = remotePostsService.getAllRemotePosts();

  res.json({
    network: 'Threadless',
    count: posts.length,
    posts
  });
});

module.exports = router;
