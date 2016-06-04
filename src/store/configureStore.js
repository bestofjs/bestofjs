import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import convertIdToSlug from './convertIdToSlug'
import convertSlugToId from './convertSlugToId'

import rootReducer from '../reducers'

const middlewares = [
  convertIdToSlug,
  convertSlugToId,
  thunk
]
if (process.env.NODE_ENV === 'development') {
  middlewares.push(
    createLogger()
  )
}

const finalCreateStore = compose(applyMiddleware(...middlewares))(createStore)

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
