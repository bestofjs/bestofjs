import fetch from 'node-fetch'

import api from '../../config/api'
import { getInitialState } from '../../src/getInitialState'
import buildXml from './build-xml'
import writeXml from './write-xml'

process.env.NODE_ENV = 'production'
const url = api('GET_PROJECTS') + 'projects.json'

fetch(url)
  .then(response => {
    console.log('Got the response from', url)
    return response.json()
  })
  .then(json => {
    console.log('Creating the RSS feed from', json.projects.length, 'projects')
    const state = getInitialState(json, null, { ssr: true })
    const projectIds = state.githubProjects.weekly.slice(0, 10)
    const projects = projectIds.map(id => state.entities.projects[id])
    const xml = buildXml(projects)
    return xml
  })
  .then(xml => writeXml(xml, 'weekly-trends.xml'))
  .catch(err => console.log('ERROR!', err.stack))
  .then(console.log)
