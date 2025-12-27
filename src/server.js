require('dotenv').config();
require('./db');

const postsService = require('./services/posts');
postsService.seedPost();

const express = require('express');

const homeRoute = require('./routes/index');
const trustRoute = require('./routes/trust');
const feedRoute = require('./routes/feed');
const postRoute = require('./routes/post');
const connectionsRoute = require('./routes/connections');

const app = express();
const PORT = 3000;

app.use('/', homeRoute);
app.use(trustRoute);
app.use(feedRoute);
app.use(postRoute);
app.use(connectionsRoute);



app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});
