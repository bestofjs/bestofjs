import test from 'tape'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {
  mount
} from 'enzyme'

import setup from '../setup.js'

// Data
import data from '../data/projects.json'

// Components to check
import Home from '../../src/components/home/Home'
import ProjectList from '../../src/components/projects/ProjectList'
import ProjectCard from '../../src/components/projects/ProjectCard'
import { getHotProjects, getPopularTags } from '../../src/selectors'
import getStore from '../getStore'

setup()

test('Check <ProjectList>', assert => {
  const count = 10
  const store = getStore(data)
  const state = store.getState()
  const projects = getHotProjects(state)

  const component = mount(
    <MemoryRouter>
      <ProjectList
        projects={projects}
      />
    </MemoryRouter>
  )
  assert.ok(component, 'The component should exist.')
  const foundProjects = component.find(ProjectCard)
  assert.equal(foundProjects.length, count, 'There should be N projects.')
  assert.end()
})

test('Check <Home> component', (assert) => {
  const store = getStore(data)
  const state = store.getState()
  const projects = getHotProjects(state)
  const tags = getPopularTags(state)

  const component = mount(
    <MemoryRouter>
      <Provider store={store}>
        <Home
          hotProjects={projects}
          uiActions={{}}
          authActions={{}}
          popularTags={tags}
        />
      </Provider>
    </MemoryRouter>
  )

  assert.ok(component, 'The component should exist.')

  const lists = component.find(ProjectList)

  assert.equal(lists.length, 1, 'There should be 1 lists of projects.')

  assert.end()
})
