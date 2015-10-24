import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import configureStore from './store/configureStore';

import getGithubProjects from './getInitialData';

getGithubProjects().then( json => startRedux(json) );

function startRedux(githubProjects) {

  const initialState = {
    staticContent: {
        projectName: 'bestof222.js.org',
        repo: 'https://github.com/michaelrambeau/bestofjs-webui'
    },
    githubProjects
  };
  console.log('initialState', initialState);

  const store = configureStore(initialState);

  if (true) render(
    <Provider store={store}>
      <ReduxRouter mike="xxx" />
    </Provider>,
    window.document.getElementById('app')
  );
}
