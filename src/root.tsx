import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  useLocation,
  useHistory
} from 'react-router-dom'

import configureStore from './store'
import { fetchProjects } from './actions/entitiesActions'
import createAuthApi from './api/auth/auth-api'
import track from './helpers/track'
import { fetchProjectsIfNeeded } from './actions/entitiesActions'
import { App } from './app'
import { useAppUpdateChecker } from 'app-update-checker'

export const Root = () => {
  useAppUpdateChecker({ interval: 5000, isDebugMode: true })
  const store = configureStore({})
  const authApi = createAuthApi({ dispatch: store.dispatch })
  const dependencies = { authApi }

  useEffect(() => {
    store.dispatch(fetchProjects())
  }, [store])

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
  const history = useHistory()

  const {
    dependencies: { authApi },
    store
  } = props

  useEffect(() => {
    authApi.start(history)
  }, [authApi, history])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo(0, 0)
    track(location.pathname)

    // if the user is on the TOP page, reload data if data is stale
    if (location.pathname === '/') {
      store.dispatch(fetchProjectsIfNeeded())
    }
  }, [location, store])
  return <App {...props} />
}
