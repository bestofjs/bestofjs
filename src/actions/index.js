import { fetchHTML, fetchJSON } from '../helpers/fetch'
import log from '../helpers/log'
import api from '../../config/api'

export const GET_README_REQUEST = 'GET_README_REQUEST'
export const GET_README_SUCCESS = 'GET_README_SUCCESS'
export const GET_README_FAILURE = 'GET_README_FAILURE'

export const TOGGLE_MENU = 'TOGGLE_MENU'

function requestReadme(id) {
  return {
    type: GET_README_REQUEST,
    id
  }
}

function requestProjectData(id) {
  return {
    type: 'GET_PROJECT_DATA_REQUEST',
    id
  }
}

function getReadmeSuccess(id, html) {
  return {
    type: GET_README_SUCCESS,
    id,
    html
  }
}

function getProjectDataSuccess(id, payload) {
  return {
    type: 'GET_PROJECT_DATA_SUCCESS',
    id,
    payload
  }
}

function getReadmeFailure(id) {
  return {
    type: GET_README_FAILURE,
    id,
    data: { readme: 'ERROR' }
  }
}

function getProjectDataFailure(id) {
  return {
    type: 'GET_PROJECT_DATA_FAILURE',
    id
  }
}

export function toggleMenu() {
  return {
    type: TOGGLE_MENU
  }
}

export function fetchReadme(project) {
  const id = project.slug
  return dispatch => {
    log('Fetching README.md...', project)
    dispatch(requestReadme(id))
    const webtaskUrl = api('GET_README')
    const branch = project.branch || 'master'
    return fetchHTML(`${webtaskUrl}/${project.full_name}?branch=${branch}`)
      .then(html => dispatch(getReadmeSuccess(id, html)))
      .catch(response => dispatch(getReadmeFailure(id, response)))
  }
}

function shouldFetchReadme(state, project) {
  const readme = state.entities.projects[project.slug].readme
  if (!readme) {
    return true
  }
  // if (readme.isFetching) {
  //   return false;
  // }
  log('Readme already in the cache!')
  return false
}

export function fetchReadmeIfNeeded(project) {
  return (dispatch, getState) => {
    if (shouldFetchReadme(getState(), project)) {
      return dispatch(fetchReadme(project))
    }
  }
}

export function getLinksSuccess(json) {
  return {
    type: 'GET_LINKS_SUCCESS',
    data: json
  }
}

export function fetchProjectData(project) {
  const id = project.slug
  return dispatch => {
    log('Fetching project data...', project)
    dispatch(requestProjectData(id))
    const url = api('GET_PROJECT_DATA')
    return fetchJSON(`${url}/projects/${project.full_name}`)
      .then(html => dispatch(getProjectDataSuccess(id, html)))
      .catch(response => dispatch(getProjectDataFailure(id, response)))
  }
}
