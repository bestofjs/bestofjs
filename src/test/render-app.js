import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, Simulate, wait, prettyDOM } from 'react-testing-library'

import createAuthMockApi from '../api/auth/auth-mock-api'
import configureStore from '../store'
import { App } from './app'
import { fetchProjectsSuccess } from '../actions/entitiesActions'
import data from './data/projects.json'

function renderWithContext(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    store
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    // adding `history` to the returned utilities to allow us to reference it in our tests
    history,
    store
  }
}

export default function renderApp({ route, locale = 'en' }) {
  const store = configureStore({})
  store.dispatch(fetchProjectsSuccess(data))
  const storage = {
    get: key => 'mike',
    set: (key, value) => null,
    delete: key => null
  }
  const authApi = createAuthMockApi({ dispatch: store.dispatch })
  const dependencies = {
    authApi
  }
  const result = renderWithContext(
    <App store={store} dependencies={dependencies} />,
    { route }
  )
  const { container } = result
  const mainNode = container.querySelector('#main')
  return {
    ...result,
    store,
    authApi,
    mainNode
  }
}
