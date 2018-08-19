import processProject from './processProject'

const handlers = {
  FETCH_PROJECTS_SUCCESS: (state, action) => setProjects(state, action.payload),
  GET_README_SUCCESS: (state, action) => ({
    ...state,
    [action.id]: { ...state[action.id], readme: action.html }
  }),
  GET_PROJECT_DATA_SUCCESS: (state, action) => {
    const { id, payload } = action
    const { contributor_count, commit_count } = payload.github
    const { npm, bundle, packageSize } = payload
    return {
      ...state,
      [id]: {
        ...state[id],
        deltas: action.payload['daily-trends'],
        commit_count,
        contributor_count,
        npm,
        bundle,
        packageSize
      }
    }
  },
  GET_PROJECT_DATA_FAILURE: (state, action) => {
    const { errorMessage, id } = action
    const npm = {
      errorMessage
    }
    const project = { ...state[id], npm }
    return { ...state, [id]: project }
  }
}

export default function(state = {}, action) {
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

function setProjects(entities, payload) {
  const projectsBySlug = payload.projects
    .map(processProject)
    .reduce((acc, project) => {
      return { ...acc, [project.slug]: project }
    }, {})
  return projectsBySlug
}
