import processProject from './processProject'

export default function(state = {}, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS_SUCCESS':
      return setProjects(state, action.payload)
    case 'GET_README_SUCCESS':
      return {
        ...state,
        [action.id]: { ...state[action.id], readme: action.html }
      }
    case 'GET_PROJECT_DATA_SUCCESS':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          deltas: action.payload['daily-trends']
        }
      }
    default:
      return state
  }
}

function setProjects(entities, payload) {
  const projectsBySlug = payload.projects
    .map(processProject)
    .reduce((acc, project) => {
      return { ...acc, [project.slug]: project }
    }, {})
  return projectsBySlug
}
