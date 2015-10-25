import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
//import { devTools } from 'redux-devtools';
import createHistory from 'history/lib/createHashHistory';
import routes from '../routes';
import thunk from 'redux-thunk';
//import api from '../middleware/api';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

//Disable key=_123456 parameter add automatically when using the hash history.
const history = createHistory({queryKey: false});

let finalCreateStore;
if (process.env.NODE_ENV === 'development') {
  finalCreateStore = compose(
    applyMiddleware(thunk),
    reduxReactRouter({ routes, history }),
    applyMiddleware(createLogger())
    //,devTools()
  )(createStore);
} else {
  finalCreateStore = compose(
    applyMiddleware(thunk),
    reduxReactRouter({ routes, history })
  )(createStore);
}

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
