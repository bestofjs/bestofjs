import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import convertIdToSlug from './convertIdToSlug'
import convertSlugToId from './convertSlugToId'

import rootReducer from '../reducers'

const middlewares = [
  convertIdToSlug,
  convertSlugToId,
  thunk
]

const finalCreateStore = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

export default function configureStore (initialState) {
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
