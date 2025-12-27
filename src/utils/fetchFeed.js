async function fetchFeed(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${url}`);
  }

  return res.json();
}

module.exports = {
  fetchFeed
};
