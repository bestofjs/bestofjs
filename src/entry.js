/* eslint-disable import/first */
// Object.assign() polyfill for IE (used in the reducer)
import './helpers/es6-polyfill.js'
// Promise polyfill to avoid "Promise is undefined" error in IE
require('es6-promise').polyfill()

import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'

import { fetchJSON } from './helpers/fetch'

import configureStore from './store/configureStore'
import api from '../config/api'
import { fetchAllReviews } from './actions/reviewActions'
import { fetchAllLinks } from './actions/linkActions'
import { fetchAllHeroes } from './actions/hofActions'
import menu from './helpers/menu'
import log from './helpers/log'
import App from './App'

import { fetchProjectsFromAPI, fetchProjectsSuccess } from './actions/entitiesActions'

function start () {
  const store = configureStore({})
  if (process.env.NODE_ENV === 'development') window.store = store
  fetchProjectsFromAPI()
    .then(data => {
      store.dispatch(fetchProjectsSuccess(data))
      dispatchActions({ store })
    })
    .catch(e => console.error('Unable to render', e))
}

start()

function dispatchActions({ store }) {
  if (window.location.pathname !== '/hof/') {
    // default case: render the app as soon as we get project data
    renderApp(store)
    // store.dispatch(fetchAllHeroes())
  } else {
    // if HoF is currently displayed used server-side rendering,
    // render the app AFTER we get HoF data, to avoid display an empty list
    store.dispatch(fetchAllHeroes())
      .then(() => {
        renderApp(store)
      })
  }
}

// fetchData()
//   .then(data => {
//     const state = getInitialState(data)
//     startRedux(state)
//   })

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

function renderComponent (Component, store) {
  render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    window.document.getElementById('app')
  )
}

function renderApp (store) {
  renderComponent(App, store)
  if (module.hot) {
    module.hot.accept('./App', () => {
      renderComponent(App, store)
    })
  }
}
