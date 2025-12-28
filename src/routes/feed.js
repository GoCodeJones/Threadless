const express = require('express');
const router = express.Router();
const postsService = require('../services/posts');

router.get('/feed', (req, res) => {
  const posts = postsService.getAllPosts();

  res.json({
    threadless: 'v0',
    blog: {
      id: process.env.BLOG_ID || 'threadless-local',
      name: process.env.BLOG_NAME || 'Threadless Blog',
      site: process.env.BLOG_SITE || 'http://localhost:3000'
    },
    posts: posts.map(post => ({
      slug: post.slug,
      title: post.title,
      content: post.content,
      published_at: post.published_at
    }))
  });
});

module.exports = router;
