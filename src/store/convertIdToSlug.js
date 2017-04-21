import { convertPayload, convertItem } from '../helpers/crud'

// Replace project database ids by slugs
// when we get data from userContent API
const convert = store => next => action => {
  if (true && action.meta && action.meta.convertProjectIds) {
    const state = store.getState()
    const projects = state.entities.projects
    const byFullname = Object.keys(projects)
      .map(key => ({
        slug: key,
        full_name: projects[key].full_name
      }))
      .reduce(
        (acc, item) => Object.assign({}, acc, {
          [item.full_name]: item.slug
        }),
        {}
      )
    const getSlug = id => byFullname[id]
    // const getSlug = name => slugify(name)
    const fn = convertItem(getSlug)
    const payload = convertPayload(action.payload, fn)
    const action2 = Object.assign({}, action, { payload })
    return next(action2)
  }

  // Call the next dispatch method in the middleware chain.
  return next(action)
}
export default convert
