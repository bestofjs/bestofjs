import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
//import { devTools } from 'redux-devtools';
import createHistory from 'history/lib/createHashHistory';
import routes from '../routes';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

// Custom middlewares
import navigationMiddleware from './navigationMiddleware';
import trackingMiddleware from './trackingMiddleware';


//Disable key=_123456 parameter add automatically when using the hash history.
const history = createHistory({queryKey: true});

let middlewares = [
  reduxReactRouter({ routes, history }),
  applyMiddleware(navigationMiddleware),
  applyMiddleware(trackingMiddleware),
  applyMiddleware(thunk)
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
