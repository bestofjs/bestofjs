import React from 'react';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import getRoutes from './routes';
import { getInitialState } from './projectData';

// Grab the state from a global injected into server-generated HTML
const state = getInitialState(window.bestofjs.projects);
const store = configureStore(state);

const history = useRouterHistory(createHashHistory)({ queryKey: false });

import menu from './helpers/menu';

const Root = React.createClass({
  componentDidMount() {
    menu.start();
  },
  render() {
    // How many "hot" and "popular" projects to display in the home page rendered on the server ?
    const TOP_PROJECT_COUNT = 10;
    return (
      <Provider store={ store }>
        <Router history={ history }>
          { getRoutes(TOP_PROJECT_COUNT) }
        </Router>
      </Provider>
    );
  }
});
export default Root;
