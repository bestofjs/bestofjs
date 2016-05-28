// Promise polyfill to avoid "Promise is undefined" error in IE
require('es6-promise').polyfill()

// Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js'
import fetchJSON from './helpers/fetchJSON'

import React from 'react'
import { render } from 'react-dom'
// import { whyDidYouUpdate } from 'why-did-you-update'

// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouUpdate(React)
// }

import Router from 'react-router/lib/Router'
import browserHistory from 'react-router/lib/browserHistory'
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware'
import useScroll from 'react-router-scroll'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import getRoutes from './routes'
import api from '../config/api'
import { getInitialState } from './projectData'
import { fetchAllReviews } from './actions/reviewActions'
import { fetchAllLinks } from './actions/linkActions'
import { fetchAllHeroes } from './actions/hofActions'
import menu from './helpers/menu'
import log from './helpers/log'
import track from './helpers/track'

if (process.env.NODE_ENV === 'development') {
  // to be used from the DevTools console, with "React Perf" Chrome extension
  window.Perf = require('react-addons-perf')
}

fetchData()
  .then(data => {
    const state = getInitialState(data)
    startRedux(state)
  })

// Stylesheets are included here to avoid server-side rendering errors
require('./stylesheets/main.styl')
require('./stylesheets/tooltip/balloon.css')
require('../node_modules/react-select/dist/react-select.css')

// Track every router update (except project views that are tracked elsewhere)
function trackPageView(state) {
  const path = state.location.pathname
  const routes = state.routes
  if (routes.length > 1 && routes[1].path === 'projects/:id') return false
  track(path)
}

function onRouterUpdate() {
  menu.hide()
  trackPageView(this.state)
}

// Launch the Redux application once we get data
function startRedux(state) {
  const initialState = state
  const store = configureStore(initialState)
  if (process.env.NODE_ENV === 'development') window.store = store
  render(
    <Provider store={ store }>
      <Router
        history={browserHistory}
        onUpdate={onRouterUpdate}
        render={applyRouterMiddleware(useScroll())}
      >
         {getRoutes(10)}
      </Router>
    </Provider>,
    window.document.getElementById('app')
  )

  store.dispatch(fetchAllReviews())
  store.dispatch(fetchAllLinks())
  store.dispatch(fetchAllHeroes())
  // it was hard to find the right place to initialize the sidebar menu
  // because of server side rendering script ('window is not defined' error)
  log('Initialize the sidebar menu')
  menu.start()
}

function fetchData() {
  const isLocal = window.bestofjs && window.bestofjs.projects
  return isLocal ? fetchLocalData() : fetchServerData()
}

function fetchLocalData() {
  // read data from global `bestofjs` object
  return Promise.resolve(window.bestofjs.projects)
}

function fetchServerData() {
  const url = `${api('GET_PROJECTS')}projects.json`
  return fetchJSON(url)
    .then(json => new Promise(resolve => {
      window.localStorage.setItem('bestofjs_projects', JSON.stringify(json))
      resolve(json)
    }))
}
