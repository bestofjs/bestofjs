import test from 'tape'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { createStore } from 'redux'

import {
  mount
} from 'enzyme'

import setup from '../setup.js'

// Data
import data from '../data/projects.json'
import links from '../data/links.json'
import reviews from '../data/reviews.json'

import { getInitialState } from '../../src/getInitialState'
import rootReducer from '../../src/reducers'
import populate from '../../src/helpers/populate'

// Actions
import * as actions from '../../src/actions/crudActions'

// Components to check
import ProjectList from '../../src/components/projects/ProjectList'
import ProjectCard from '../../src/components/projects/ProjectCard'

setup()

const state = getInitialState(data)
// const store = configureStore(state)
const store = createStore(rootReducer, state)

const {
  entities,
  githubProjects
} = state

const projects = githubProjects.total
  .slice(0, 50)
  .map(id => entities.projects[id])
  .map(populate(entities.tags))
const count = projects.length

// 1. Test the component before the link data arrive
test('Check <ProjectList> component BEFORE data arrives', (assert) => {
  const component = mount(
    <MemoryRouter>
      <ProjectList
        projects={projects}
      />
    </MemoryRouter>
  )
  assert.ok(component, `The component should exist.`)
  const cards = component.find(ProjectCard)
  assert.equal(cards.length, count, `There should be ${count} projects`)
  assert.end()
})

// 2. Get "link" and "review" data
const userContentItems = {
  'link': links,
  'review': reviews
}
const testItems = key => {
  test(`Check state after "${key}" data arrives`, assert => {
    const items = userContentItems[key]
    store.dispatch(actions.fetchAllItemsSuccess(key, items))
    const state1 = store.getState()
    const itemCount = items.results.length
    const stateItems = Object.keys(state1.entities[`${key}s`]).map(id => state1.entities[`${key}s`][id])
    assert.equal(stateItems.length, itemCount, `There should be ${itemCount} "${key}" items in the state`)
    assert.end()
  })
}
testItems('link')
testItems('review')

// 3. Check the component after data arrives
test('Check <ProjectList> component AFTER data arrives', (assert) => {
  const component = mount(
    <MemoryRouter>
      <ProjectList
        projects={projects}
      />
    </MemoryRouter>
  )
  assert.ok(component, `The component should exist.`)
  const cards = component.find(ProjectCard)
  assert.equal(cards.length, count, `There should be ${count} projects`)
  assert.end()
})

test('Check <ProjectList> with React project', (assert) => {
  const filteredProjects = projects.filter(item => item.slug === 'react')
  assert.equal(1, filteredProjects.length, 'There should be one project with "react" slug')
  const component = mount(
    <MemoryRouter>
      <ProjectList
        projects={filteredProjects}
      />
    </MemoryRouter>
  )
  assert.ok(component, `The component should exist.`)
  const cards = component.find(ProjectCard)
  assert.equal(cards.length, 1, `There should be 1 card displayed`)
  // assert.equal(stateLinks.length, linkCount, `There should be ${linkCount} links in the state`)
  assert.end()
})
