import { fetchJSON } from '../helpers/fetch'

// export function saveMyProjectsRequest () {
//   return dispatch => {
//     dispatch({
//       type: 'SAVE_MY_PROJECTS_REQUEST'
//     })
//     fetchMyProjects()
//       .then(projects => dispatch({
//         type: 'FETCH_MY_PROJECTS_SUCCESS',
//         payload: projects
//       }))
//   }
// }

function saveMyProjects ({ user_id, token, projects }) {
  const url = `https://bestofjs.auth0.com/api/v2/users/${user_id}`
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

export function addToMyProjectsSuccess (project) {
  return {
    type: 'ADD_TO_MY_PROJECTS_SUCCESS',
    payload: project.slug
  }
}

export function removeFromMyProjectsSuccess (project) {
  return {
    type: 'REMOVE_FROM_MY_PROJECTS_SUCCESS',
    payload: project.slug
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
      ? myProjects.concat(project.slug)
      : myProjects.filter(slug => slug !== project.slug)
    saveMyProjects({ user_id, token, projects })
      .then(() => {
        const actionCreator = add ? addToMyProjectsSuccess : removeFromMyProjectsSuccess
        dispatch(actionCreator(project))
      })
  }
}

// Actual actions creators called from the UI
export const addToMyProjects = toggleUpdateMyProjects(true)
export const removeFromMyProjects = toggleUpdateMyProjects(false)
