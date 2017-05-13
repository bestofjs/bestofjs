// Hall of Fame page server-side rendering
// Create `www/hof/index.html` page

import fetch from 'node-fetch'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import api from '../../config/api'
import getFullPage from './getFullPage'
import renderApp from './renderApp'
import write from './write-html'

import rootReducer from '../../src/reducers'
import { getInitialState } from '../../src/getInitialState'
import { fetchAllHeroes } from '../../src/actions/hofActions'

// Get data from production API
process.env.NODE_ENV = 'production'
const url = api('GET_PROJECTS') + 'projects.json'

fetch(url)
  .then(response => {
    console.log('Got the response from', url)
    return response.json()
  })
  .then(json => {
    console.log('Got JSON', Object.keys(json))

    console.log('Start server rendering, using data from', json.projects.length, 'projects')
    const state = getInitialState(json)
    const middlewares = [
      applyMiddleware(thunk),
    ]
    const finalCreateStore = compose(...middlewares)(createStore)
    const store = finalCreateStore(rootReducer, state)

    return store.dispatch(fetchAllHeroes())
      .then(result => {
        console.log('Rendering the Hall of Fame', result.payload.length)
        return renderApp(store, '/hof')
          .then(html => {
            write(
              getFullPage({ html, isDev: false }),
              'hof/index.html'
            )
          })
      })
  })
  .catch(err => console.log('ERROR!', err.stack))
