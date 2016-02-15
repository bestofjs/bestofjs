import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { syncHistory } from 'react-router-redux';
import { hashHistory } from 'react-router';

import rootReducer from '../reducers';

// Custom middlewares
// import navigationMiddleware from './navigationMiddleware';
// import trackingMiddleware from './trackingMiddleware';
const reduxRouterMiddleware = syncHistory(hashHistory);

const middlewares = [
  // applyMiddleware(navigationMiddleware),
  // applyMiddleware(trackingMiddleware),
  applyMiddleware(thunk),
  applyMiddleware(reduxRouterMiddleware)
];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(
    applyMiddleware(createLogger())
  );
}

const finalCreateStore = compose(...middlewares)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
