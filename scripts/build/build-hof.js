/* eslint-disable no-console */
// Hall of Fame page server-side rendering
// Create `www/hall-of-fame/index.html` page

import fetch from 'node-fetch'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import api from '../../config/api'
import getFullPage from './getFullPage'
import renderApp from './renderApp'
import write from './write-html'

import rootReducer from '../../src/reducers'
import { fetchAllHeroes } from '../../src/actions/hofActions'
import { fetchProjectsSuccess } from '../../src/actions/entitiesActions'

// Get data from production API
const url = api('GET_PROJECTS') + 'projects.json'

fetch(url)
  .then(response => {
    console.log('Got the response from', url)
    return response.json()
  })
  .then(json => {
    console.log('Got JSON', Object.keys(json))

    console.log(
      'Start server rendering, using data from',
      json.projects.length,
      'projects'
    )
    const middlewares = [applyMiddleware(thunk)]
    const finalCreateStore = compose(...middlewares)(createStore)
    const store = finalCreateStore(rootReducer)
    store.dispatch(fetchProjectsSuccess(json))

    return store.dispatch(fetchAllHeroes()).then(result => {
      console.log('Rendering the Hall of Fame', {
        count: result.payload.length
      })
      return renderApp(store, '/hall-of-fame').then(html => {
        const title = 'The JavaScript Hall of Fame'
        const description =
          'The JavaScript Hall of Fame gathers the most important members of the JavaScript community: authors, speakers and developers. Say hello to TJ, Sindre, Dan and friends!'
        return write(
          getFullPage({ html, isDev: false, title, description }),
          'hall-of-fame/index.html'
        )
      })
    })
  })
  .then(console.log)
  .catch(err => console.log('ERROR!', err.stack))
