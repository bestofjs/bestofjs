import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, Simulate, wait, prettyDOM } from 'react-testing-library'

import { App } from '../app'
import { ProjectDataProvider } from 'containers/project-data-container'
import { AuthProvider } from 'containers/auth-container'

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
  const result = renderWithContext(
    <AuthProvider>
      <ProjectDataProvider>
        <App />
      </ProjectDataProvider>
    </AuthProvider>,
    { route }
  )
  const { container } = result
  const mainNode = container.querySelector('#main')
  return {
    ...result,
    mainNode
  }
}
