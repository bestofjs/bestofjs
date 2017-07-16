const defaultState = {
  username: '',
  pending: false
}
export default function auth(state = defaultState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, pending: true }
    case 'LOGIN_SUCCESS':
      return { ...state, ...action.payload, pending: false }
    case 'LOGIN_FAILURE':
      return { ...state, pending: false }
    // LOGOUT
    case 'LOGOUT_REQUEST':
      return { ...state, pending: true }
    case 'LOGOUT_SUCCESS':
      return {
        pending: false,
        username: ''
      }
    case 'LOGOUT_FAILURE':
      return { ...state, pending: false }
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
  myProjects: [...state.myProjects, { slug, bookmarked_at: new Date() }],
  pendingProject: ''
})
const removeFromMyProjects = (state, slug) => ({
  ...state,
  myProjects: state.myProjects.filter(item => item.slug !== slug),
  pendingProject: ''
})
const updateMyProjectsRequest = (state, project) => ({
  ...state,
  pendingProject: project.slug
})
