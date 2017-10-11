import test from 'tape'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

// Main components to test
import getHomePage from '../../src/containers/HomePage'

// Sub components
import ProjectList from '../../src/components/projects/ProjectList'

// Data
import data from '../data/projects.json'
import getStore from '../../scripts/getStore'

import setup from '../setup.js'
setup()

test('Check <HomePage> container', assert => {
  const TOP_PROJECT_COUNT = 20
  const HomePage = getHomePage(TOP_PROJECT_COUNT)
  const store = getStore(data)
  const component = mount(
    <MemoryRouter>
      <Provider store={store}>
        <HomePage />
      </Provider>
    </MemoryRouter>
  )

  assert.ok(component, 'The component should exist.')

  const Lists = component.find(ProjectList)

  assert.equal(Lists.length, 1, 'There should be 1 list of projects.')

  // The next test does not work with "stateless" components! TODO fix it!

  // Lists.forEach(List => {
  //   const projects = List.find(ProjectList.Row)
  //   assert.equal(
  //     projects.length,
  //     TOP_PROJECT_COUNT,
  //     `There should be ${TOP_PROJECT_COUNT} projects.`
  //   )
  // })

  assert.end()
})
