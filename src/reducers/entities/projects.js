import slugify from 'slugify'

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
  projects.forEach(project => {
    const slug = slugify(project.name, { lower: true, remove: /[.']/g })
    projectsBySlug[slug] = {
      slug,
      ...project,
      packageName: project.npm
    }
  })
  return projectsBySlug
}
