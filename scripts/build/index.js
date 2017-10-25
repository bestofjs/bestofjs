/*
`npm run build-html` entry script
Get project data from a static json file and build `www/index.html` file
*/
/* eslint-disable no-console */
require('./setup')
import fetch from 'node-fetch'

const minify = require('html-minifier').minify

import api from '../../config/api'
import getFullPage from './getFullPage'
import renderApp from './renderApp'
import write from './write-html'
import getStore from '../getStore'

import { getPopularTags } from '../../src/selectors'

// Get data from production API
const url = api('GET_PROJECTS') + 'projects.json'

function getAllSettings(tags) {
  return [].concat(
    tags.map(tag => ({
      path: `tags/${tag.id}`,
      title: `Best of JavaScript | '${tag.name}' projects`,
      description: `The best projects under '${tag.name}' tag, from Best of JavaScript (${tag.counter} projects).`
    })),
    { path: '' },
    { path: 'projects', title: 'Best of JavaScript | All projects' }
  )
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
    const settings = getAllSettings(tags)
    const promises = settings.map(createPage(store))
    return Promise.all(promises)
  })
  .catch(err => console.log('ERROR!', err.stack))
  .then(result => console.log('Server-side rendering done!', result))

const createPage = store => pageSettings => {
  const { path, title, description } = pageSettings
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
    return write(
      getFullPage({ html: minified, isDev: false, title, description }),
      filepath
    )
  })
}
