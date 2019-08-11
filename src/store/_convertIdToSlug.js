import { convertItem, convertPayload } from '../helpers/crud'
import { getProjectSlugFromFullname } from '../selectors'

// Replace project database ids by slugs
// when we get data from userContent API
const convert = store => next => action => {
  if (action.meta && action.meta.convertProjectIds) {
    const state = store.getState()
    const getSlug = id => getProjectSlugFromFullname(id)(state)
    const fn = convertItem(getSlug)
    const payload = convertPayload(action.payload, fn)
    return next({ ...action, payload })
  }

  // Call the next dispatch method in the middleware chain.
  return next(action)
}
export default convert
