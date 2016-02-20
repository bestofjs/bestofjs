import React from 'react';
import { Router, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createHashHistory';
import { syncReduxAndRouter } from 'react-router-redux';
import useScroll from 'scroll-behavior/lib/useScrollToTop';

import configureStore from './store/configureStore';
import getRoutes from './routes';
import { getInitialState } from './projectData';

// Grab the state from a global injected into server-generated HTML
//const state = window.__INITIAL_STATE__;
const state = getInitialState(window.bestofjs.projects);
const store = configureStore(state);

// Disable key=_123456 parameter add automatically when using the hash history.
// const history = createHistory({ queryKey: false });
const history = useScroll(createHistory)({ queryKey: false });


import menu from './helpers/menu';

// require *.styl intructions have been moved from components to the App.jsx container
// to be able to run tests with node.js

require('../node_modules/react-select/dist/react-select.css');

function hideSplashScreen() {
  const elements = document.querySelectorAll('.nojs');
  Array.prototype.forEach.call(elements, (el) => el.classList.remove('nojs'));

  // Add the stylesheets to overwrite inline styles defined in index.html
  require('./stylesheets/main.styl');
}

const Root = React.createClass({
  componentDidMount() {
    console.info('Menu start!');
    menu.start();
  },
  render() {
    // syncReduxAndRouter(history, store);
    return (
      <Provider store={ store }>
        <Router history={ hashHistory }>
          { getRoutes(10) }
        </Router>
      </Provider>
    );
  }
});
export default Root;
