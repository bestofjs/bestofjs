import { convertPayload, convertItem } from '../helpers/crud'

// Replace project database ids by slugs
// when we get data from userContent API
const convert = store => next => action => {
  if (action.meta && action.meta.convertProjectIds) {
    const state = store.getState()
    const getSlug = id => state.githubProjects.allById[id]
    const fn = convertItem(getSlug)
    const payload = convertPayload(action.payload, fn)
    const action2 = Object.assign({}, action, { payload })
    return next(action2)
  }

  // Call the next dispatch method in the middleware chain.
  return next(action)
}
export default convert
