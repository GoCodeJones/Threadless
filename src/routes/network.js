const express = require('express');
const path = require('path');
const router = express.Router();
const remotePosts = require('../services/remotePosts');
const trustService = require('../services/trust');

router.get('/network', (req, res) => {
  const posts = remotePosts.getAllRemotePosts().map(post => ({
    ...post,
    origin: post.connection_id,
    trust: trustService.getTrust(post.connection_id)
  }));

  res.json({
    network: 'Threadless',
    count: posts.length,
    posts
  });
});

router.get('/network/ui', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/network.html'));
});

module.exports = router;
