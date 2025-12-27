const express = require('express');
const router = express.Router();
const postsService = require('../services/posts');

router.get('/', (req, res) => {
  const posts = postsService.getAllPosts();

  const list = posts
    .map(
      (post) => `
        <li>
          <a href="/post/${post.slug}">
            ${post.title}
          </a>
          <small> — ${new Date(post.published_at).toLocaleDateString()}</small>
        </li>
      `
    )
    .join('');

  res.send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${process.env.SITE_NAME}</title>
      </head>
      <body>
        <h1>${process.env.SITE_NAME}</h1>
        <ul>
          ${list}
        </ul>
      </body>
    </html>
  `);
});

module.exports = router;
