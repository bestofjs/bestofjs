// `npm run build-html` entry script
// Get project data from a static json file and build `www/index.html` file

import fetch from 'node-fetch'
import fs from 'fs-extra'

import api from '../../config/api'
import getFullPage from './getFullPage'
import renderApp from './renderApp'

import rootReducer from '../../src/reducers'
import { createStore } from 'redux'
import { getInitialState } from '../../src/getInitialState'
import { getPopularTags } from '../../src/selectors'

// Get data from production API
process.env.NODE_ENV = 'production'
const url = api('GET_PROJECTS') + 'projects.json'

function getAllPages (tags) {
  const tagPages = tags.map(tag => ({ path: `/tags/${tag.id}`, filepath: `/tags/${tag.id}/index.html` }))
  const allPages = [{ path: '/', filepath: 'index.html' }].concat(tagPages)
  return allPages
}

fetch(url)
  .then(response => {
    console.log('Got the response from', url)
    return response.json()
  })
  .then(json => {
    console.log('Got JSON', Object.keys(json))

    console.log('Start server rendering, using data from', json.projects.length, 'projects')
    const state = getInitialState(json)
    const store = createStore(rootReducer, state)
    const tags = getPopularTags(state)
    const allPages = getAllPages(tags)
    const promises = allPages.map(createPage(store))
    return Promise.all(promises)
  })
  .catch(err => console.log('ERROR!', err.stack))
  .then(result => console.log('Server-side rendering done!', result))

function write (html, filename) {
  // path relative from the root folder when the script is launched from the npm command
  const writer = fs.createOutputStream(`./www/${filename}`)
  writer.write(html)
  writer.end()
  return Promise.resolve(`${filename} file created (${(html.length / 1024).toFixed()} KB)`)
}

const createPage = store => ({ path, filepath }) => {
  return renderApp(store, path)
    .then(html => {
      return write(getFullPage(false, html), filepath)
    })
}
