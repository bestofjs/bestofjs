import { renderToString } from 'react-dom/server';
import React from 'react';
import { Router } from 'react-router';
// import createHashHistory from 'history/lib/createHashHistory';
import { match, RouterContext, useRouterHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from '../src/containers/App';
import rootReducer from '../src/reducers';
import getRoutes from '../src/routes';

// Data
import data from '../test/data/projects';
import { getInitialState } from '../src/projectData';

export default function renderHtml(cb) {
  // Create a new Redux store instance
  console.log('Start server rendering');
  const state = getInitialState(data);
  const store = createStore(rootReducer, state);

  // Grab the initial state from our Redux store
  const initialState = store.getState();
  let html = '';

  // const history = useRouterHistory(createHashHistory)({ queryKey: false });
  match({ routes: getRoutes(3), location: '/' }, (error, redirectLocation, renderProps) => {
    html = renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    );

    // Add hashes in URLs
    html = html.replace(/href=\"\/([^"]*)\"/g, 'href=\"#/$1\"');

    // Send the rendered page back to the client
    const fullpage = renderFullPage(html, initialState);
    cb(null, fullpage);
  });


  // Render the component to a string
  if (false) html = renderToString(
    <Provider store={store}>
      <Router history={ null }>
        { Routes() }
      </Router>
    </Provider>
  );

}

function renderFullPage(html, initialState) {
  return (`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>The Best of JavaScript and the web platorm</title>
        <meta name="description" content="bestof.js.org is a place where front-end engineers and node.js developers can find the best components to build amazing web applications.">
        <!-- added for Github pages -->
        <link rel="shortcut icon" href="favicon.ico">
      </head>
      <body>
        <div id="app"><div>${html}</div></div>
        <!-- Async load cross-site CSS, mostly interesting for production -->
        <script>
          window.bestofjs = {};
          function loadCSS(e,t,n){"use strict";var i=window.document.createElement("link");var o=t||window.document.getElementsByTagName("script")[0];i.rel="stylesheet";i.href=e;i.media="only x";o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||"all"})}
          loadCSS('https://fonts.googleapis.com/css?family=Roboto:400,300,500');
          loadCSS('https://cdnjs.cloudflare.com/ajax/libs/octicons/3.1.0/octicons.min.css');
        </script>
        <script>
          window.bestofjs = { projects: ${JSON.stringify(data)} };
        </script>
        <script src="http://cdn.auth0.com/w2/auth0-6.7.js"></script>
        <script src="build/bundle-vendor.js"></script>
        <script src="build/bundle-app.js"></script>
      </body>
    </html>
  `);
}
