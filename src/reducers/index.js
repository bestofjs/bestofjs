import { combineReducers } from 'redux'

import entities from './entities'
import auth from './auth'
import hof from './hof'
import ui from './ui'
import requests from './requests'

const rootReducer = combineReducers({
  entities,
  auth,
  hof,
  ui,
  requests
})

export default rootReducer
