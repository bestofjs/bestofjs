import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createHashHistory';
import { syncReduxAndRouter } from 'redux-simple-router';

import configureStore from './store/configureStore';
import Routes from './routes';

// Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js';
import { getInitialData } from './projectData';
import loading from './helpers/loading';

import { getLinksSuccess, getReviewsSuccess } from './actions';
import links from './mock/mockLinks';
import reviews from './mock/mockReviews';

// Set up the http request interceptor used to display the "loading bar"
loading.init();

// STEP 1: get project data from the static JSON file hosted on the CDN
getInitialData().then(json => startRedux(json));

// STEP 2: Launch the Redux application once we get data
function startRedux(state) {
  const store = configureStore(state);
  store.dispatch(getLinksSuccess(links));
  store.dispatch(getReviewsSuccess(reviews));

  // Disable key=_123456 parameter add automatically when using the hash history.
  const history = createHistory({ queryKey: false });

  syncReduxAndRouter(history, store);

  render(
    <Provider store={ store }>
      <Router history={ history }>
        { Routes() }
      </Router>
    </Provider>,
    window.document.getElementById('app')
  );
}
