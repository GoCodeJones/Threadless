const db = require('../db');

function addConnection({ id, name, site, feed }) {
  db.prepare(`
    INSERT INTO connections (id, name, site, feed)
    VALUES (?, ?, ?, ?)
  `).run(id, name, site, feed);
}

function getAllConnections() {
  return db
    .prepare('SELECT id, name, site, feed FROM connections')
    .all();
}

module.exports = {
  addConnection,
  getAllConnections
};
