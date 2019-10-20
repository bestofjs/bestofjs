import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import configureStore from './store'
import App from './App'
import AppUIContainer from './AppUIContainer'

import { fetchProjects } from './actions/entitiesActions'
import { unregister } from './registerServiceWorker'
import createAuthApi from './api/auth/auth-api'

// Old-fashioned stylesheets
import './stylesheets/base.css'

function start() {
  const root = document.getElementById('root')
  const store = configureStore({})
  const authApi = createAuthApi({ dispatch: store.dispatch })
  const dependencies = { authApi }
  // STEP 1: Render the app layout, without projects
  render(
    <Router>
      <AppUIContainer store={store} dependencies={dependencies}>
        <App store={store} dependencies={dependencies} />
      </AppUIContainer>
    </Router>,
    root
  )
  // STEP 2: Fetch project and tag data from the API (thr static JSON file hosted on Firebase)
  store.dispatch(fetchProjects())
}

start()
unregister()
