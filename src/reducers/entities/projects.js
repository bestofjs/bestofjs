import { getProjectId } from '../../components/core/project'

const handlers = {
  FETCH_PROJECTS_SUCCESS: (state, action) =>
    getProjectsBySlug(action.payload.projects)
}

export default function(state = {}, action) {
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

function getProjectsBySlug(projects) {
  const projectsBySlug = {}
  const total = projects.length

  projects.forEach((project, index) => {
    const slug = getProjectId(project)
    projectsBySlug[slug] = {
      slug,
      addedPosition: total - index,
      ...project,
      packageName: project.npm
    }
  })
  return projectsBySlug
}
