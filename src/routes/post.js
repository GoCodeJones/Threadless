const express = require('express');
const router = express.Router();
const postsService = require('../services/posts');

router.get('/post/:slug', (req, res) => {
  const { slug } = req.params;
  const post = postsService.getPostBySlug(slug);

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }

  res.json(post);
});

module.exports = router;
