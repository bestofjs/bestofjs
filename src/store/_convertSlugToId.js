import { convertPayload, convertItem } from '../helpers/crud'

// Before calling userContent API to create or update data,
// transform project slugs to GitHub `full_name`
const convert = store => next => action => {
  if (true && action.meta && action.meta.convertProjectSlugs) {
    const state = store.getState()
    const getId = slug => state.entities.projects[slug].full_name
    const fn = convertItem(getId)
    const payload = convertPayload(action.payload, fn)
    const action2 = Object.assign({}, action, { payload })
    return next(action2)
  }

  // Call the next dispatch method in the middleware chain.
  return next(action)
}
export default convert
