import React from 'react'
import { render } from 'react-dom'

import configureStore from './store/configureStore'
import App from './App'
import {
  fetchProjectsFromAPI,
  fetchProjectsSuccess
} from './actions/entitiesActions'
import menu from './helpers/menu'
import registerServiceWorker from './registerServiceWorker'

// Old-fashioned stylesheets
import './stylesheets/tooltip/balloon.css'
import '../node_modules/react-select/dist/react-select.css'
import './stylesheets/base.css'
import './stylesheets/slideout.css'
import './stylesheets/github-corner.css'

function start() {
  const root = document.getElementById('root')
  const store = configureStore({})
  fetchProjectsFromAPI()
    .then(data => {
      store.dispatch(fetchProjectsSuccess(data))
      render(<App store={store} />, root)
      menu.start()
    })
    .catch(e => console.error('Unable to render', e)) // eslint-disable-line no-console
}

start()
registerServiceWorker()
