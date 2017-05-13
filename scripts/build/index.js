// `npm run build-html` entry script
// Get project data from a static json file and build `www/index.html` file

import fetch from 'node-fetch'

const minify = require('html-minifier').minify;

import api from '../../config/api'
import getFullPage from './getFullPage'
import renderApp from './renderApp'
import write from './write-html'

import rootReducer from '../../src/reducers'
import { createStore } from 'redux'
import { getInitialState } from '../../src/getInitialState'
import { getPopularTags } from '../../src/selectors'

// Get data from production API
process.env.NODE_ENV = 'production'
const url = api('GET_PROJECTS') + 'projects.json'

function getAllPaths (tags) {
  const tagPaths = tags.map(tag => `tags/${tag.id}`)
  const paths = [ '', 'projects' ].concat(tagPaths)
  return paths
}

fetch(url)
  .then(response => {
    console.log('Got the response from', url)
    return response.json()
  })
  .then(json => {
    console.log('Got JSON', Object.keys(json))
    console.log('Start server rendering, using data from', json.projects.length, 'projects')
    const state = getInitialState(json, null, { ssr: true })
    const store = createStore(rootReducer, state)
    const tags = getPopularTags(state)
    const paths = getAllPaths(tags)
    const promises = paths.map(createPage(store))
    return Promise.all(promises)
  })
  .catch(err => console.log('ERROR!', err.stack))
  .then(result => console.log('Server-side rendering done!', result))

const createPage = store => path => {
  const url = `/${path}`
  const filepath = `${path}/index.html`
  const options = {
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true
  }
  return renderApp(store, url)
    .then(html => {
      const minified = minify(html, options)
      return write(getFullPage({ html: minified, isDev: false }), filepath)
    })
}
