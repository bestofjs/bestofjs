import React from 'react'
import { Router } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { createMemoryHistory } from 'history'

import { App } from './app'
import configureStore from './store'
import createAuthMockApi from './api/auth/auth-mock-api'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const history = createMemoryHistory()
  const store = configureStore({})
  const authApi = createAuthMockApi({ dispatch: store.dispatch })
  const dependencies = { authApi }
  ReactDOM.render(
    <Router history={history}>
      <App store={store} dependencies={dependencies} />
    </Router>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
