import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { fetchProjectsSuccess } from '../src/actions/entitiesActions'
import rootReducer from '../src/reducers'

export default function getStore(
  data,
  { withThunk = false, initialState = {} } = {}
) {
  const createAppStore = withThunk
    ? compose(applyMiddleware(thunk))(createStore)
    : createStore
  const store = createAppStore(rootReducer, initialState)
  store.dispatch(fetchProjectsSuccess(data))
  return store
}
