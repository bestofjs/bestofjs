// `npm run html` entry script
// build 2 html files:
// - www/index.html: to be deployed on production
// - www/dev.html: for local tests (served by Webpack dev server)

import fetch from 'node-fetch';
import fs from 'fs-extra';

import getFullPage from './getFullPage';
import renderApp from './renderApp';

process.env.NODE_ENV = 'production';
const url = 'https://bestofjs-api-dev.firebaseapp.com/projects.json';

fetch(url)
  .then(response => {
    console.log('Got the response from', url);
    return response.json();
  })
  .then(json => {
    console.log('Got JSON', Object.keys(json));
    return renderApp(json)
      .then(html => {
        write(
          getFullPage(false, html),
          'index.html'
        );
      });
  })
  .catch(err => console.log('ERROR!', err.stack));

function write(html, filename) {
  // path relative from the root folder when the script is launched from the npm command
  const writer = fs.createOutputStream(`./www/${filename}`);
  writer.write(html);
  writer.end();
  console.log(`${filename} file created!`, html.length);
}
