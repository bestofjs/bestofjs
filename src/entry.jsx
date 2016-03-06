import React from 'react';
import { render } from 'react-dom';
import request from 'axios';
// import { Router } from 'react-router';
// import { Provider } from 'react-redux';
// import createHistory from 'history/lib/createHashHistory';
// import { syncReduxAndRouter } from 'react-router-redux';
// import useScroll from 'scroll-behavior/lib/useScrollToTop';

import Root from './Root';
// import configureStore from './store/configureStore';
// import Routes from './routes';

import api from '../config/api';

// Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js';

// import { getInitialData } from './projectData';
import loading from './helpers/loading';
import { getInitialState } from './projectData';

// Set up the http request interceptor used to display the "loading bar"
loading.init();

fetchData()
  .then(data => {
    const state = getInitialState(data);
    startRedux(state);
  });


require('./stylesheets/main.styl');
require('../node_modules/react-select/dist/react-select.css');

function initAuth0() {
  const loc = window.location;
  window.auth0 = new Auth0({
    domain: 'bestofjs.auth0.com',
    clientID: 'MJjUkmsoTaPHvp7sQOUjyFYOm2iI3chx',
    callbackURL: `${loc.protocol}//${loc.host}/#authenticated`,
    callbackOnLocationHash: true
  });
}

if (false) getToken()
  .then(token => getProfile(token))
  // .then(profile => getInitialData(profile))
  // .then(json => startRedux(json))
  .catch(err => console.err('ERROR!!!', err.message));

// Launch the Redux application once we get data
function startRedux(state) {
  // const store = configureStore(state);
  // store.dispatch(fetchAllReviews());
  // store.dispatch(fetchAllLinks());

  render(
    <Root initialState={state} />,
    window.document.getElementById('app')
  );
}

function fetchData() {
  const isLocal = window.bestofjs && window.bestofjs.projects;
  return isLocal ? fetchLocalData() : fetchServerData();
}

function fetchLocalData() {
  // read data from global `bestofjs` object
  return Promise.resolve(window.bestofjs.projects);
}

function fetchServerData() {
  const url = `${api('GET_PROJECTS')}projects.json`;
  return request(url)
    .then(response => response.data)
    .then(json => new Promise(resolve => {
      window.localStorage.setItem('bestofjs_projects', JSON.stringify(json));
      resolve(json);
    }));
}


// Return UserProfile for a given `access_token`
function getProfile(token) {
  return new Promise((resolve) => {
    if (!token) return resolve(null);
    window.auth0.getProfile(token, function (err, profile) {
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
  const result = auth0.parseHash(window.location.hash);
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
