import setup from '../setup.js'
setup()

import test from 'tape'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from '../../src/reducers'

// Main components to test
import AboutPage from '../../src/containers/AboutPage'

import {
  mount
} from 'enzyme'

import data from '../data/projects.json'
import { getInitialState } from '../../src/getInitialState'

test('Check <AboutPage> container', (assert) => {
  const state = getInitialState(data)
  const finalCreateStore = compose(applyMiddleware(thunk))(createStore)
  const store = finalCreateStore(rootReducer, state)

  const component = mount(
    <MemoryRouter>
      <Provider store={store}>
        <AboutPage />
      </Provider>
    </MemoryRouter>
  )

  assert.ok(component, `The component should exist.`)

  assert.end()
})
