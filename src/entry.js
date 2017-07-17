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
  if (window.location.pathname !== '/hof/') {
    // default case: render the app as soon as we get project data
    renderApp(store)
    store.dispatch(fetchAllHeroes())
  } else {
    // if HoF is currently displayed used server-side rendering,
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
require('./stylesheets/main.styl')
require('./stylesheets/tooltip/balloon.css')
require('../node_modules/react-select/dist/react-select.css')

function renderComponent(Component, store) {
  render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    window.document.getElementById('app')
  )
}

function renderApp(store) {
  renderComponent(App, store)
  if (module.hot) {
    module.hot.accept('./App', () => {
      renderComponent(App, store)
    })
  }
}
