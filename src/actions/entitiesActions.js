import { fetchJSON } from '../helpers/fetch'
import api from '../../config/api'

export function fetchProjectsFromAPI () {
  const url = `${api('GET_PROJECTS')}projects.json`
  return fetchJSON(url)
}

export function fetchProjectsSuccess (payload) {
  return {
    type: 'FETCH_PROJECTS_SUCCESS',
    payload
  }
}

// Action to be called to start the app
export function fetchProjects () {
  return dispatch => {
    fetchProjectsFromAPI()
      .then(data => dispatch(fetchProjectsSuccess(data)))
  }
}
