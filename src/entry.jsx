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

// Launch the Redux application once we get data
function startRedux(state) {
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
