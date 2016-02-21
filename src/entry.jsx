import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createHashHistory';
import { syncReduxAndRouter } from 'react-router-redux';
import useScroll from 'scroll-behavior/lib/useScrollToTop';

import Root from './Root'
import configureStore from './store/configureStore';
import Routes from './routes';

// Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js';
import { getInitialData } from './projectData';
import loading from './helpers/loading';

// import { getLinksSuccess, getReviewsSuccess } from './actions';
import { fetchAllReviews } from './actions/reviewActions';
import { fetchAllLinks } from './actions/linkActions';
// import links from './mock/mockLinks';
// import reviews from './mock/mockReviews';

// Set up the http request interceptor used to display the "loading bar"
loading.init();

require('./stylesheets/main.styl');
require('../node_modules/react-select/dist/react-select.css');

window.auth0 = new window.Auth0({
  domain: 'bestofjs.auth0.com',
  clientID: 'MJjUkmsoTaPHvp7sQOUjyFYOm2iI3chx',
  callbackURL: 'http://localhost:8080/#authenticated',
  callbackOnLocationHash: true
});

startRedux();
if (false) getToken()
  .then(token => getProfile(token))
  .then(profile => getInitialData(profile))
  .then(json => startRedux(json))
  .catch(err => console.err('ERROR!!!', err.message));

// Launch the Redux application once we get data
function startRedux(state) {
  console.info('Start the Redux app', state);
  // const store = configureStore(state);

  // store.dispatch(fetchAllReviews());
  // store.dispatch(fetchAllLinks());

  // Disable key=_123456 parameter add automatically when using the hash history.
  // const history = createHistory({ queryKey: false });
  // const history = useScroll(createHistory)({ queryKey: false });

  // syncReduxAndRouter(history, store);

  render(
    <Root />,
    window.document.getElementById('app')
  );
}


// Return UserProfile for a given `access_token`
function getProfile(token) {
  return new Promise((resolve, reject) => {
    if (!token) return resolve(null);
    auth0.getProfile(token, function (err, profile) {
      if (err) resolve(null);
      return resolve(profile);
    });
  });
}

// Return user's `id_token` (JWT) checking:
// - first the URL hash (when coming from Gittub authentication page)
// - then the local storage
// Return null if no token is found
function getToken() {
  const key = 'bestofjs_id_token';
  const result = window.auth0.parseHash(window.location.hash);
  let id_token = '';
  let access_token = '';
  if (result && result.id_token) {
    id_token = result.id_token;
    access_token = result.access_token;
    window.localStorage.setItem(key, id_token);
    window.localStorage.setItem('bestofjs_access_token', access_token);
    return Promise.resolve(id_token);
  }
  id_token = localStorage[key];
  if (id_token) {
    return Promise.resolve(id_token);
  }
  return Promise.resolve('');
}
