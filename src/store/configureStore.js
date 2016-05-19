import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import rootReducer from '../reducers'

const middlewares = [
  applyMiddleware(thunk),
]
if (process.env.NODE_ENV === 'development') {
  middlewares.push(
    applyMiddleware(createLogger())
  )
}

const finalCreateStore = compose(...middlewares)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
