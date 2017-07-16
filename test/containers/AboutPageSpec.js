import test from 'tape'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'

import getStore from '../getStore'

// Main components to test
import AboutPage from '../../src/containers/AboutPage'
import data from '../data/projects.json'

import setup from '../setup.js'
setup()

test('Check <AboutPage> container', assert => {
  const store = getStore(data)
  const component = mount(
    <MemoryRouter>
      <Provider store={store}>
        <AboutPage />
      </Provider>
    </MemoryRouter>
  )

  assert.ok(component, 'The component should exist.')

  assert.end()
})
