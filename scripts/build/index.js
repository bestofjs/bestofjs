/*
`npm run build-html` entry script
Get project data from a static json file and build `www/index.html` file
*/
/* eslint-disable no-console */

import fetch from 'node-fetch'

const minify = require('html-minifier').minify

import api from '../../config/api'
import getFullPage from './getFullPage'
import renderApp from './renderApp'
import write from './write-html'
import getStore from '../getStore'

import { getPopularTags } from '../../src/selectors'

// Get data from production API
process.env.NODE_ENV = 'production'
const url = api('GET_PROJECTS') + 'projects.json'

function getAllPaths(tags) {
  const tagPaths = tags.map(tag => `tags/${tag.id}`)
  const paths = ['', 'projects'].concat(tagPaths)
  return paths
}

const initialState = {
  entities: {
    projects: {},
    tags: {}
  },
  auth: {
    username: '',
    pending: true
  },
  ui: {
    hotFilter: 'daily',
    viewOptions: {
      description: true,
      npms: true,
      packagequality: false,
      commit: true
    },
    paginated: true
  }
}

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
    const store = getStore(json, initialState)
    const state = store.getState()
    const tags = getPopularTags(state)
    const paths = getAllPaths(tags)
    const promises = paths.map(createPage(store))
    return global.Promise.all(promises)
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
  return renderApp(store, url).then(html => {
    const minified = minify(html, options)
    return write(getFullPage({ html: minified, isDev: false }), filepath)
  })
}
