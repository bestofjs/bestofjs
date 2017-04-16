import track from './helpers/track'
import menu from './helpers/menu'

function onRouterUpdate (location) {
  if (typeof window === 'undefined') return
  menu.hide()
  window.scrollTo(0, 0)
  track(location.pathname)
}

export default onRouterUpdate
