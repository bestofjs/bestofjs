const defaultState = {
  username: '',
  pending: true
}
export default function auth (state = defaultState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, { pending: true })
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, action.payload, {
        pending: false
      })
    case 'LOGIN_FAILURE':
      return Object.assign({}, state, { pending: false })
  // LOGOUT
    case 'LOGOUT_REQUEST':
      return Object.assign({}, state, { pending: true })
    case 'LOGOUT_SUCCESS':
      return {
        pending: false,
        username: ''
      }
    case 'LOGOUT_FAILURE':
      return Object.assign({}, state, { pending: false })
    case 'UPDATE_MY_PROJECTS_REQUEST':
      return updateMyProjectsRequest(state, action.payload)
    case 'ADD_TO_MY_PROJECTS_SUCCESS':
      return addToMyProjects(state, action.payload)
    case 'REMOVE_FROM_MY_PROJECTS_SUCCESS':
      return removeFromMyProjects(state, action.payload)
    default:
      return state
  }
}

const addToMyProjects = (state, slug) => ({
  ...state,
  myProjects: [ ...state.myProjects, slug ],
  pendingProject: ''
})
const removeFromMyProjects = (state, slug) => ({
  ...state,
  myProjects: state.myProjects.filter(item => item !== slug),
  pendingProject: ''
})
const updateMyProjectsRequest = (state, project) => ({
  ...state,
  pendingProject: project.slug
})
