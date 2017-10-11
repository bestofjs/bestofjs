import test from 'tape'
import React from 'react'

import { shallow } from 'enzyme'

import setup from '../setup.js'
import populate from '../../src/helpers/populate'

// Data
import data from '../data/projects.json'
import getStore from '../../scripts/getStore'

// Actions
import * as actions from '../../src/actions'

// Components to check
import Project from '../../src/components/projects/ProjectCard'

setup()

const store = getStore(data)
const state = store.getState()

const { entities: { projects, tags } } = state

const id = 'react'

let project = projects[id]
project = populate(tags)(project)

test('Check <Project> component', assert => {
  const component = shallow(<Project project={project} actions={actions} />)

  assert.ok(component, 'The component should exist.')

  const header = component.find('header')
  const title = project.name
  assert.ok(
    header.html().indexOf(title) > -1,
    `Project name '${title}' should be displayed in the header`
  )

  assert.end()
})
