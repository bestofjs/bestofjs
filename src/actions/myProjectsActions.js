import { APP_URL, readUserProjects } from '../api/auth/auth0'
import { fetchJSON } from '../helpers/fetch'

function saveMyProjects({ user_id, token, projects }) {
  const url = `${APP_URL}/api/v2/users/${user_id}`
  const body = {
    user_metadata: {
      projects
    }
  }
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }
  return fetchJSON(url, options)
}

export function addToMyProjectsSuccess(projects) {
  return {
    type: 'ADD_TO_MY_PROJECTS_SUCCESS',
    payload: projects
  }
}

export function removeFromMyProjectsSuccess(projects) {
  return {
    type: 'REMOVE_FROM_MY_PROJECTS_SUCCESS',
    payload: projects
  }
}

const toggleUpdateMyProjects = add => project => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_MY_PROJECTS_REQUEST',
      payload: project
    })
    const state = getState()
    const { user_id, token, myProjects } = state.auth
    const projects = add
      ? addToMyProjectsIfUnique(myProjects, project.slug)
      : myProjects.filter(item => item.slug !== project.slug)
    saveMyProjects({ user_id, token, projects }).then(profile => {
      const myProjects = readUserProjects(profile)
      const actionCreator = add
        ? addToMyProjectsSuccess
        : removeFromMyProjectsSuccess
      dispatch(actionCreator(myProjects))
    })
  }
}

// Add the project to user's list only if it has not already bookmarked before
function addToMyProjectsIfUnique(myProjects, slug) {
  const found = myProjects.map(item => item.slug).find(item => item === slug)
  return found
    ? myProjects
    : myProjects.concat({ bookmarked_at: new Date(), slug })
}

// Actual actions creators called from the UI
export const addToMyProjects = toggleUpdateMyProjects(true)
export const removeFromMyProjects = toggleUpdateMyProjects(false)
