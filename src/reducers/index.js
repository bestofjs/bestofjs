import { combineReducers } from 'redux'

import entities from './entities'
import auth from './auth'
import ui from './ui'
import requests from './requests'

const rootReducer = combineReducers({
  entities,
  auth,
  ui,
  requests
})

export default rootReducer
