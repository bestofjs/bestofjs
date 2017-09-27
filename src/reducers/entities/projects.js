import processProject from './processProject'

const handlers = {
  FETCH_PROJECTS_SUCCESS: (state, action) => setProjects(state, action.payload),
  GET_README_SUCCESS: (state, action) => ({
    ...state,
    [action.id]: { ...state[action.id], readme: action.html }
  }),
  GET_PROJECT_DATA_SUCCESS: (state, action) => {
    const { contributor_count, commit_count } = action.payload.github
    const { dependencies } = action.payload.npm
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        deltas: action.payload['daily-trends'],
        commit_count,
        contributor_count,
        dependencies
      }
    }
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
