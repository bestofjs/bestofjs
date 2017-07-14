import processProject from './processProject'

export default function (state = {}, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS_SUCCESS':
      return setProjects(state, action.payload)
    case 'GET_README_SUCCESS':
      const project = { ...state[action.id], readme: action.html }
      return { ...state, [action.id]: project }
    default:
      return state
  }
}

function setProjects (entities, payload) {
  const projectsBySlug = payload.projects
    .map(processProject)
    .reduce((acc, project) => {
      return {...acc, [project.slug]: project}
    }, {})
  return projectsBySlug
}
