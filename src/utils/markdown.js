const { marked } = require('marked');

function renderMarkdown(content) {
  return marked.parse(content);
}

module.exports = {
  renderMarkdown
};
