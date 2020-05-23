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
import { ToastContainer } from 'components/core/toast'

export const Root = () => {
  const store = configureStore({})
  const authApi = createAuthApi({ dispatch: store.dispatch })
  const dependencies = { authApi }

  useEffect(() => {
    store.dispatch(fetchProjects())
  }, [store])

  return (
    <Router>
      <ToastContainer>
        <AppWithRouter store={store} dependencies={dependencies} />
      </ToastContainer>
    </Router>
  )
}

// Routing side effects
// We cannot call `useLocation` from the previous component
// because the Router context has not been created yet
const AppWithRouter = props => {
  const location = useLocation()
  const history = useHistory()

  useAppUpdateChecker({ interval: 10 * 1000, isSimulationMode: false })

  const {
    dependencies: { authApi },
    store
  } = props

  useEffect(() => {
    authApi.start(history)
  }, [authApi, history])

  useEffect(() => {
    console.log(location.pathname)
    if (typeof window === 'undefined') return
    window.scrollTo(0, 0)
    track(location.pathname)

    // if the user is on the TOP page, reload data if data is stale
    if (location.pathname === '/') {
      store.dispatch(fetchProjectsIfNeeded())
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  return <App {...props} />
}
