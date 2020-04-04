import { combineReducers } from 'redux'

import entities from './entities'
import auth from './auth'

const rootReducer = combineReducers({
  entities,
  auth
})

export default rootReducer
