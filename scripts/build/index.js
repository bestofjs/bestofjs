// `npm run build-html` entry script
// Get project data from a static json file and build `www/index.html` file

import fetch from 'node-fetch';
import fs from 'fs-extra';

import api from '../../config/api';
import getFullPage from './getFullPage';
import renderApp from './renderApp';

process.env.NODE_ENV = 'development';
const url = api('GET_PROJECTS') + 'projects.json';

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
