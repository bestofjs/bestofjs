/* eslint-disable import/first */
// Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js'
// Promise polyfill to avoid "Promise is undefined" error in IE
require('es6-promise').polyfill()

import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'

import configureStore from './store/configureStore'
import { fetchAllHeroes } from './actions/hofActions'
import menu from './helpers/menu'
import log from './helpers/log'
import App from './App'

import {
  fetchProjectsFromAPI,
  fetchProjectsSuccess
} from './actions/entitiesActions'

function start() {
  const store = configureStore({})
  fetchProjectsFromAPI()
    .then(data => {
      store.dispatch(fetchProjectsSuccess(data))
      dispatchActions({ store })
    })
    .catch(e => console.error('Unable to render', e)) // eslint-disable-line no-console
}

start()

function dispatchActions({ store }) {
  if (window.location.pathname !== '/hall-of-fame/') {
    // default case: render the app as soon as we get project data
    renderApp(store)
    store.dispatch(fetchAllHeroes())
  } else {
    // if HoF is currently displayed via the server-side rendering,
    // render the app AFTER we get HoF data, to avoid display an empty list
    store.dispatch(fetchAllHeroes()).then(() => {
      renderApp(store)
    })
  }
  // it was hard to find the right place to initialize the sidebar menu
  // because of server side rendering script ('window is not defined' error)
  log('Initialize the sidebar menu')
  menu.start()
}

// Stylesheets are included here to avoid server-side rendering errors
// require('./stylesheets/main.styl')
import './stylesheets/tooltip/balloon.css'
import '../node_modules/react-select/dist/react-select.css'
import './stylesheets/base.css'
import './stylesheets/slideout.css'
import './stylesheets/github-corner.css'

function renderComponent(Component, store, hotreload) {
  render(
    hotreload ? (
      <AppContainer>
        <Component store={store} />
      </AppContainer>
    ) : (
      <Component store={store} />
    ),
    window.document.getElementById('app')
  )
}

function renderApp(store) {
  const hotreload = !process.env.USE_PREACT && module.hot
  renderComponent(App, store, hotreload)
  if (hotreload) {
    module.hot.accept('./App', () => {
      renderComponent(App, store)
    })
  }
}
