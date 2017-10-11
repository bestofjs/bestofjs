import test from 'tape'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'

import data from '../data/projects.json'

import HoFPage from '../../src/containers/HoFPage'
import Card from '../../src/components/hof/HeroCard'
import { getAllHeroes } from '../../src/helpers/hof'
import hof from '../data/hof.json'
import { fetchHeroesSuccess } from '../../src/actions/hofActions'
import getStore from '../../scripts/getStore'

import setup from '../setup.js'
setup()

test('Check <HoFPage> container', assert => {
  const store = getStore(data)

  store.dispatch(fetchHeroesSuccess(hof))
  const newState = store.getState()
  const heroes = getAllHeroes(newState)

  assert.equal(heroes[0].username, 'tj', 'TJ should be the king!')
  assert.ok(heroes.length > 70, 'There should be more than 70 hall of famers')

  const component = mount(
    <MemoryRouter>
      <Provider store={store}>
        <HoFPage />
      </Provider>
    </MemoryRouter>
  )

  assert.ok(component, 'The component should exist.')

  const cards = component.find(Card)
  assert.equal(
    heroes.length,
    cards.length,
    'All hall of famers should be displayed'
  )

  assert.end()
})
