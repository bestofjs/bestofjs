const fs = require('fs');
require('dotenv').load();

const commit = require('./commit');

fs.readFile('www/index.html', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('Filesystem OK!', data.length, data);
  commitHtml(data);
});

function commitHtml(html) {
  commit({
    filepath: 'index.html',
    content: html,
    repo: 'michaelrambeau/bestofjs-sandbox',
    branch: 'gh-pages',
    token: process.env.GITHUB_ACCESS_TOKEN
  });
}

function commitEmptyContent() {
  commit({
    filepath: 'index.html',
    content: `<p>Empty content, created at ${new Date()}</p>`,
    repo: 'michaelrambeau/bestofjs-sandbox',
    branch: 'gh-pages',
    token: process.env.GITHUB_ACCESS_TOKEN
  });
}
