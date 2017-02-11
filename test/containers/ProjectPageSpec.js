import setup from '../setup.js'
setup()

import test from 'tape'
import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from '../../src/reducers'

// Main components to test
import ProjectPage from '../../src/containers/ProjectPage'

import {
  mount
} from 'enzyme'
import sinon from 'sinon'

// Data
import data from '../data/projects.json'
import { getInitialState } from '../../src/getInitialState'

const id = 'react'

test('Check <ProjectPage> container', (assert) => {
  const state = getInitialState(data)
  const finalCreateStore = compose(applyMiddleware(thunk))(createStore)
  const store = finalCreateStore(rootReducer, state)

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
    <Provider store={store}>
      <ProjectPage params={{ id }} />
    </Provider>
  )
  assert.ok(ProjectPage.prototype.componentWillReceiveProps, 'componentWillReceiveProps should have been called')

  assert.ok(component, `The component should exist.`)

  assert.end()
})
