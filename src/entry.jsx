import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';

import configureStore from './store/configureStore';
//Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js';
import {getInitialData} from './projectData';
import loading from './helpers/loading';

//Set up the http request interceptor
loading.init();

//STEP 1: get project data from the static JSON file hosted on the CDN
getInitialData().then( json => startRedux(json) );

//STEP 2: Launch the Redux application once we get data
function startRedux(githubProjects) {

  const initialState = {
    githubProjects
  };

  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <ReduxRouter />
    </Provider>,
    window.document.getElementById('app')
  );
}
