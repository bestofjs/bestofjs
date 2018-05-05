/*
`npm run build-html` entry script
Get project data from a static json file and build `www/index.html` file
*/
/* eslint-disable no-console */
import fetch from 'node-fetch'
import { minify } from 'html-minifier'

import api from '../../src/config/api'
import renderApp from './render-app'
import write from './write-html'
import getStore from '../getStore'
import { getPopularTags } from '../../src/selectors'
import { readHtmlTemplate, writeHtmlFile } from './filesystem-utils'
import initialState from './initial-state.json'
import interpolateHtml from './interpolate-html'
import { fetchAllHeroes } from '../../src/actions/hofActions'
require('./setup')

function getAllSettings(tags) {
  return [].concat(
    tags.map(tag => ({
      path: `tags/${tag.id}`,
      title: `Best of JavaScript | '${tag.name}' projects`,
      description: `The best projects under '${tag.name}' tag, from Best of JavaScript (${tag.counter} projects).`
    })),
    { path: '', title: 'Best of JavaScript' },
    { path: 'projects', title: 'Best of JavaScript | All projects' },
    {
      path: 'hall-of-fame',
      title: 'The JavaScript Hall of Fame',
      description:
        'The JavaScript Hall of Fame gathers the most important members of the JavaScript community: authors, speakers and developers. Say hello to TJ, Sindre, Dan and friends!'
    }
  )
}

export default async function buildAllPages() {
  try {
    // Get data from production API
    const url = api('GET_PROJECTS') + 'projects.json'
    console.log('Fetching data from', url)
    const json = await fetch(url).then(res => res.json())
    console.log('Rendering, using data from', json.projects.length, 'projects')
    const store = getStore(json, { initialState, withThunk: true })
    await store.dispatch(fetchAllHeroes())
    const state = store.getState()
    const tags = getPopularTags(state)
    const settings = getAllSettings(tags)
    const template = await readHtmlTemplate()
    const result = await Promise.all(
      settings.map(createPage({ template, store }))
    )
    console.log('All pages built!', result)
    return result
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const createPage = ({ store, template }) => pageSettings => {
  const { path, title, description } = pageSettings
  const url = `/${path}`
  const options = {
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true
  }
  const { appHtml, styles } = renderApp({ store, location: url })
  const pageHtml = interpolateHtml({
    template,
    title,
    description,
    appHtml,
    styles
  })
  // const pageHtml = htmlTemplate({ title, description, appHtml, styles })
  const minified = minify(pageHtml, options)
  return writeHtmlFile({ html: minified, pathname: path })
}
