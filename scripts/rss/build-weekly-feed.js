/* eslint-disable no-console */
import fetch from 'node-fetch'

import api from '../../src/config/api'
import getStore from '../getStore'
import { getProjectsSortedBy } from '../../src/selectors'
import buildXml from './build-xml'
import writeXml from './write-xml'

process.env.NODE_ENV = 'production'
const url = api('GET_PROJECTS') + 'projects.json'

export default function buildWeeklyFeed() {
  console.log('Fetching projects...', url)
  fetch(url)
    .then(response => {
      console.log('Got the response from', url)
      return response.json()
    })
    .then(json => {
      console.log(
        'Creating the RSS feed from',
        json.projects.length,
        'projects'
      )
      const store = getStore(json)
      const state = store.getState()
      const projects = getProjectsSortedBy({
        criteria: 'weekly',
        start: 0,
        limit: 10
      })(state)
      const xml = buildXml(projects)
      return xml
    })
    .then(xml => writeXml(xml, 'weekly-trends.xml'))
    .catch(err => console.log('ERROR!', err.stack))
    .then(console.log)
}
