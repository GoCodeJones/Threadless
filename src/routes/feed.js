const express = require('express');
const router = express.Router();
const postsService = require('../services/posts');

router.get('/feed', (req, res) => {
  const posts = postsService.getAllPosts();

  res.json({
    site: process.env.SITE_URL,
    posts
  });
});

module.exports = router;
