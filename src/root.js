import React, { useEffect } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'

import configureStore from './store'
import { fetchProjects } from './actions/entitiesActions'
import createAuthApi from './api/auth/auth-api'
import track from './helpers/track'
import { fetchProjectsIfNeeded } from './actions/entitiesActions'
import App from './App'

export const Root = () => {
  const store = configureStore({})
  const authApi = createAuthApi({ dispatch: store.dispatch })
  const dependencies = { authApi }

  useEffect(
    () => {
      authApi.start()
      store.dispatch(fetchProjects())
    },
    [authApi, store]
  )

  return (
    <Router>
      <AppWithRouter store={store} dependencies={dependencies} />
    </Router>
  )
}

// Routing side effects
// We cannot call `useLocation` from the previous component
// because the Router context has not been created yet
const AppWithRouter = props => {
  const location = useLocation()
  const { store } = props

  useEffect(
    () => {
      if (typeof window === 'undefined') return
      window.scrollTo(0, 0)
      track(location.pathname)

      // if the user is on the TOP page, reload data if data is stale
      if (location.pathname === '/') {
        store.dispatch(fetchProjectsIfNeeded())
      }
    },
    [location, store]
  )
  return <App {...props} />
}
