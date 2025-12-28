const fetch = require('node-fetch');
const remotePosts = require('./remotePosts');

module.exports = async function fetchRemoteFeed(connection) {
  const res = await fetch(connection.feed);
  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${connection.feed}`);
  }

  const data = await res.json();

  if (!Array.isArray(data.posts)) {
    throw new Error('Invalid feed format');
  }

  for (const post of data.posts) {
    remotePosts.save({
      origin: connection.id,
      title: post.title,
      content: post.content,
      published_at: post.published_at
    });
  }
};
