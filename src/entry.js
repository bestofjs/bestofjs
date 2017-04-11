// Promise polyfill to avoid "Promise is undefined" error in IE
require('es6-promise').polyfill()

// Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js'
import { fetchJSON } from './helpers/fetch'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
// import { whyDidYouUpdate } from 'why-did-you-update'

// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouUpdate(React)
// }

import configureStore from './store/configureStore'
import api from '../config/api'
import { getInitialState } from './getInitialState'
import { fetchAllReviews } from './actions/reviewActions'
import { fetchAllLinks } from './actions/linkActions'
import { fetchAllHeroes } from './actions/hofActions'
import menu from './helpers/menu'
import log from './helpers/log'
import App from './App'

fetchData()
  .then(data => {
    const state = getInitialState(data)
    startRedux(state)
  })

// Stylesheets are included here to avoid server-side rendering errors
require('./stylesheets/main.styl')
require('./stylesheets/tooltip/balloon.css')
require('../node_modules/react-select/dist/react-select.css')

// Launch the Redux application once we get data
function startRedux (state) {
  const initialState = state
  const store = configureStore(initialState)
  if (process.env.NODE_ENV === 'development') window.store = store

  if (window.location.pathname !== '/hof/') {
    // default case: render the app as soon as we get project data
    renderApp(store)
    store.dispatch(fetchAllHeroes())
  } else {
    // if HoF is currently displayed used server-side rendering,
    // render the app AFTER we get HoF data
    store.dispatch(fetchAllHeroes())
    .then(() => {
      renderApp(store)
    })
  }

  store.dispatch(fetchAllReviews())
  store.dispatch(fetchAllLinks())

  // it was hard to find the right place to initialize the sidebar menu
  // because of server side rendering script ('window is not defined' error)
  log('Initialize the sidebar menu')
  menu.start()
}

function fetchData () {
  const isLocal = window.bestofjs && window.bestofjs.projects
  return isLocal ? fetchLocalData() : fetchServerData()
}

function fetchLocalData () {
  // read data from global `bestofjs` object
  return Promise.resolve(window.bestofjs.projects)
}

function fetchServerData () {
  const url = `${api('GET_PROJECTS')}projects.json`
  return fetchJSON(url)
    .then(json => new Promise(resolve => {
      window.localStorage.setItem('bestofjs_projects', JSON.stringify(json))
      resolve(json)
    }))
}

function renderApp (store) {
  render(
    <AppContainer>
      <App store={store} />
    </AppContainer>,
    window.document.getElementById('app')
  )
  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default
      render(
        <AppContainer>
          <NextApp store={store} />
        </AppContainer>,
        document.getElementById('app')
      )
    })
  }
}
