import { fetchJSON } from '../helpers/fetch'
import api from '../config/api'
import { isFreshDataAvailable } from '../selectors'

export function fetchProjectsFromAPI() {
  const url = `${api('GET_PROJECTS')}projects.json`
  return fetchJSON(url)
}

export function fetchProjectsSuccess(payload) {
  return {
    type: 'FETCH_PROJECTS_SUCCESS',
    payload
  }
}

// Action to be called to start the app
export function fetchProjects() {
  return dispatch => {
    dispatch({ type: 'FETCH_PROJECTS' })
    fetchProjectsFromAPI().then(data => dispatch(fetchProjectsSuccess(data)))
  }
}

export function fetchProjectsIfNeeded() {
  return (dispatch, getState) => {
    const state = getState()
    const isStale = isFreshDataAvailable(new Date())(state)
    if (isStale) dispatch(fetchProjects())
  }
}
