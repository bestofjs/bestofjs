import { fetchJSON } from '../helpers/fetch'
import api from '../api/config'
import { isFreshDataAvailable } from '../selectors'

export function fetchProjectsFromAPI() {
  const url = `${api('GET_PROJECTS')}/projects.json`
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
  return async dispatch => {
    dispatch({ type: 'FETCH_PROJECTS' })
    try {
      const data = await fetchProjectsFromAPI()
      dispatch(fetchProjectsSuccess(data))
    } catch (error) {
      dispatch({ type: 'FETCH_PROJECTS_ERROR', error })
    }
  }
}

export function fetchProjectsIfNeeded() {
  return (dispatch, getState) => {
    const state = getState()
    const isStale = isFreshDataAvailable(new Date())(state)
    if (isStale) dispatch(fetchProjects())
  }
}
