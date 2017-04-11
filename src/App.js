import React from 'react'
import Router from 'react-router/lib/Router'
import browserHistory from 'react-router/lib/browserHistory'
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware'
import useScroll from 'react-router-scroll'
import { Provider } from 'react-redux'

import getRoutes from './routes'
import track from './helpers/track'
import menu from './helpers/menu'

const App = ({ store }) => (
  <Provider store={store}>
    <Router
      history={browserHistory}
      onUpdate={onRouterUpdate}
      render={applyRouterMiddleware(useScroll())}
      children={getRoutes(10)}
    />
  </Provider>
)

function onRouterUpdate () {
  menu.hide()
  trackPageView(this.state)
}

// Track every router update (except project views that are tracked elsewhere)
function trackPageView (state) {
  const path = state.location.pathname
  const routes = state.routes
  if (routes.length > 1 && routes[1].path === 'projects/:id') return false
  track(path)
}

export default App
