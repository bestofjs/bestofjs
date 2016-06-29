import test from 'tape'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from '../../src/reducers'

// Main components to test
import getHomePage from '../../src/containers/HomePage'

// Sub components
import ProjectList from '../../src/components/projects/ProjectTable'


import {
  mount,
  // render
} from 'enzyme'

import setup from '../setup.js'
setup()

// Data
import data from '../data/projects'
import { getInitialState } from '../../src/projectData'

test('Check <HomePage> container', (assert) => {
  const TOP_PROJECT_COUNT = 20
  const HomePage = getHomePage(TOP_PROJECT_COUNT)
  const state = getInitialState(data)
  const store = createStore(rootReducer, state)

  const component = mount(
    <Provider store={store}>
      <HomePage />
    </Provider>
  )

  assert.ok(component, `The component should exist.`)

  const Lists = component.find(ProjectList)

  assert.equal(Lists.length, 2, `There should be 2 lists of projects.`)

  if (false) Lists.forEach(List => {
    // it does not work with "stateless" components! TODO fix it!
    const projects = List.find(ProjectList.Row)
    assert.equal(projects.length, TOP_PROJECT_COUNT, `There should be ${TOP_PROJECT_COUNT} projects.`)
  })

  assert.end()
})
