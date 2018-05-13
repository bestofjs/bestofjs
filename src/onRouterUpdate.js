import track from './helpers/track'
import menu from './helpers/menu'
import { fetchProjectsIfNeeded } from './actions/entitiesActions'

/**
 *  Routing side effects: what happens when a route changes
 */
const onRouterUpdate = dispatch => location => {
  if (typeof window === 'undefined') return
  // Hide the side menu (on mobiles)
  menu.hide()
  // Scroll to the top if the page
  window.scrollTo(0, 0)
  // Track the page view
  track(location.pathname)
  // if the user is on the TOP page, reload data if data is stale
  if (location.pathname === '/') {
    dispatch(fetchProjectsIfNeeded())
  }
}

export default onRouterUpdate
