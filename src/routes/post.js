const express = require('express');
const router = express.Router();
const postsService = require('../services/posts');
const { renderMarkdown } = require('../utils/markdown');

router.get('/post/:slug', (req, res) => {
  const { slug } = req.params;
  const post = postsService.getPostBySlug(slug);

  if (!post) {
    return res.status(404).send('Post não encontrado');
  }

  const html = renderMarkdown(post.content);

  res.send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${post.title}</title>
      </head>
      <body>
        <h1>${post.title}</h1>
        <article>${html}</article>
      </body>
    </html>
  `);
});

module.exports = router;
