import setup from '../setup.js'
setup()

import test from 'tape'
import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from '../../src/reducers'

// Main components to test
import AboutPage from '../../src/containers/AboutPage'

import {
  mount
} from 'enzyme'

import data from '../data/projects'
import { getInitialState } from '../../src/projectData'

test('Check <AboutPage> container', (assert) => {
  const state = getInitialState(data)
  const finalCreateStore = compose(applyMiddleware(thunk))(createStore)
  const store = finalCreateStore(rootReducer, state)

  const component = mount(
    <Provider store={store}>
      <AboutPage />
    </Provider>
  )

  assert.ok(component, `The component should exist.`)

  assert.end()
})
