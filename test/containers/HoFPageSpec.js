import setup from '../setup.js'
setup()

import test from 'tape'
import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from '../../src/reducers'

import HoFPage from '../../src/containers/HoFPage'
import Card from '../../src/components/hof/HeroCard'
import { getAllHeroes } from '../../src/helpers/hof'

import {
  mount
} from 'enzyme'

import data from '../data/projects.json'
import hof from '../data/hof.json'
import { getInitialState } from '../../src/getInitialState'
import { fetchHeroesSuccess } from '../../src/actions/hofActions'

test('Check <HoFPage> container', (assert) => {
  const state = getInitialState(data)
  const finalCreateStore = compose(applyMiddleware(thunk))(createStore)
  const store = finalCreateStore(rootReducer, state)

  store.dispatch(fetchHeroesSuccess(hof))
  const newState = store.getState()
  const heroes = getAllHeroes(newState)

  assert.equal(heroes[0].username, 'tj', 'TJ should be the king!')
  assert.ok(heroes.length > 70, `There should be more than 70 hall of famers`)

  const component = mount(
    <Provider store={store}>
      <HoFPage />
    </Provider>
  )

  assert.ok(component, `The component should exist.`)

  const cards = component.find(Card)
  assert.equal(heroes.length, cards.length, 'All hall of famers should be displayed')

  assert.end()
})
