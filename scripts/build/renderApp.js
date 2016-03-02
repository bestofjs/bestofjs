import { renderToString } from 'react-dom/server';
import React from 'react';
import { match, RouterContext } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from '../../src/reducers';
import getRoutes from '../../src/routes';

// How many "hot" and "popular" projects to display in the home page rendered on the server ?
// This number has to be very low since we only need to render "above the fold" content.
const TOP_PROJECT_COUNT = 3;

// Data
// import data from '../../test/data/projects';
import { getInitialState } from '../../src/projectData';

export default function (data) {
  return new Promise((resolve, reject) => {
    // Create a new Redux store instance
    console.log('Start server rendering, using data from', data.projects.length, 'projects');
    const state = getInitialState(data);
    const store = createStore(rootReducer, state);

    let html = '';

    match({ routes: getRoutes(TOP_PROJECT_COUNT), location: '/' }, (error, redirectLocation, renderProps) => {
      if (error) return reject(error);
      html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );

      // Add hashes in URLs
      html = html.replace(/href=\"\/([^"]*)\"/g, 'href=\"#/$1\"');

      // Send the rendered page back to the client
      // const fullpage = renderFullPage(html, initialState);
      return resolve(html);
    });
  });
}
