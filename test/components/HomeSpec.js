import test from 'tape'
import React from 'react'
import {
  mount,
  // render,
  shallow
} from 'enzyme'

import setup from '../setup.js'

// Data
import data from '../data/projects.json'
import { getInitialState } from '../../src/getInitialState'

setup()

// Components to check
import Home from '../../src/components/home/Home'
import ProjectList from '../../src/components/projects/ProjectTable'

import populate from '../../src/helpers/populate'

function getHotProjects(state) {
  return state.githubProjects.daily
    .map(id => state.entities.projects[id])
    .slice(0, 20)
    .map(populate(state.entities.tags))
}

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    githubProjects
  } = state

  const popularProjects = githubProjects.total
    .map(id => projects[id])
    .slice(0, 20)
    .map(populate(tags))

  return {
    hotProjects: getHotProjects(state),
    popularProjects
  }
}

test('Check <ProjectList>', assert => {
  const count = 20
  const state = getInitialState(data)

  const component = shallow(
    <ProjectList
      projects = { getHotProjects(state) }
    />
  )
  assert.ok(component, `The component should exist.`)
  // console.log(component.debug())
  const foundProjects = component.find(ProjectList.Row)
  assert.equal(foundProjects.length, count, `There should be N projects.`)
  assert.end()
})

test('Check <Home> component', (assert) => {
  const state = getInitialState(data)

  const props = mapStateToProps(state)

  const component = mount(
    <Home
      hotProjects={props.hotProjects }
      popularProjects={props.popularProjects}
      uiActions={{}}
      authActions={{}}
    />
  )

  assert.ok(component, `The component should exist.`)

  const lists = component.find(ProjectList)

  assert.equal(lists.length, 2, `There should be 2 lists of projects.`)

  assert.end()
})
