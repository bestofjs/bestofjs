import test from 'tape'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {
  mount
} from 'enzyme'
import sinon from 'sinon'

// Main components to test
import createProjectPage from '../../src/containers/createProjectPage'
import GithubTab from '../../src/components/ProjectView/GithubTab'

// Data
import data from '../data/projects.json'
import getStore from '../getStore'

import setup from '../setup.js'
setup()

const ProjectPage = createProjectPage(GithubTab)
const id = 'react'

test('Check <ProjectPage> container', (assert) => {
  const store = getStore(data, { withThunk: true })
  store.subscribe(() => {
    const { readme } = store.getState().entities.projects[id]
    if (readme) {
      assert.ok(readme.length > 1000, `There should be a pretty long readme in the project`)
    } else {
      // assert.fail('No readme found!')
    }
  })

  sinon.spy(ProjectPage.prototype, 'componentWillReceiveProps')
  const component = mount(
    <MemoryRouter>
      <Provider store={store}>
        <ProjectPage match={{ params: { id } }} />
      </Provider>
    </MemoryRouter>
  )
  assert.ok(ProjectPage.prototype.componentWillReceiveProps, 'componentWillReceiveProps should have been called')

  assert.ok(component, `The component should exist.`)

  assert.end()
})
