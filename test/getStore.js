import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { fetchProjectsSuccess } from '../src/actions/entitiesActions'
import rootReducer from '../src/reducers'

export default function getState (data, { withThunk = false } = {}) {
  const createAppStore = withThunk
    ? compose(applyMiddleware(thunk))(createStore)
    : createStore
  const store = createAppStore(rootReducer)
  store.dispatch(fetchProjectsSuccess(data))
  return store
}
