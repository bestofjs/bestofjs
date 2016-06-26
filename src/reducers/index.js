import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import entities from './entities'
import githubProjects from './githubProjects'
import auth from './auth'
import hof from './hof'
import ui from './ui'
import requests from './requests'

const rootReducer = combineReducers({
  entities,
  githubProjects,
  auth,
  form: formReducer,
  hof,
  ui,
  requests
})

export default rootReducer
