import React from 'react';
import { Router, useRouterHistory } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
import createBrowserHistory from 'history/lib/createHashHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import getRoutes from './routes';
import { fetchAllReviews } from './actions/reviewActions';
import { fetchAllLinks } from './actions/linkActions';
import menu from './helpers/menu';
import log from './helpers/log';

// How many "hot" and "popular" projects to display in the home page rendered on the server ?
const TOP_PROJECT_COUNT = 10;

const Root = React.createClass({
  componentWillMount() {
    this.init();
  },
  componentDidMount() {
    menu.start();
    this.store.dispatch(fetchAllReviews());
    this.store.dispatch(fetchAllLinks());
  },
  init() {
    const initialState = this.props.initialState;
    this.store = configureStore(initialState);
    const createScrollHistory = useScroll(createBrowserHistory);
    this.appHistory = useRouterHistory(createScrollHistory)();
    // this.history = syncHistoryWithStore(this.appHistory, this.store);
  },
  render() {
    log('Render <Root>');
    return (
      <Provider store={ this.store }>
        <Router history={ this.appHistory }>
          { getRoutes(TOP_PROJECT_COUNT) }
        </Router>
      </Provider>
    );
  }
});
export default Root;
