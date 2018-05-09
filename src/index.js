import React from 'react'
import { render } from 'react-dom'

import configureStore from './store/configureStore'
import App from './App'
import { fetchProjects } from './actions/entitiesActions'
import menu from './helpers/menu'
import { unregister } from './registerServiceWorker'

// Old-fashioned stylesheets
import './stylesheets/global-styles'
import './stylesheets/balloon.css'
import '../node_modules/react-select/dist/react-select.css'
import './stylesheets/base.css'
import './stylesheets/slideout.css'
import './stylesheets/github-corner.css'

function start() {
  const root = document.getElementById('root')
  const store = configureStore({})
  // STEP 1: Render the app layout, without projects
  render(<App store={store} />, root)
  // STEP 2: Fetch project and tag data from the API (thr static JSON file hosted on Firebase)
  store.dispatch(fetchProjects())
  menu.start()
}

start()
unregister()
