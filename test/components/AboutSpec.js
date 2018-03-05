import test from 'tape'
import React from 'react'
import TestUtils from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'

import { getAllTags } from '../utils'
import setup from '../setup.js'
import getStaticContent from '../../src/staticContent'

// Components to check
import About from '../../src/components/about/About'
const staticContent = getStaticContent()

setup()

test('Check <About> component', assert => {
  const component = TestUtils.renderIntoDocument(
    <MemoryRouter>
      <About staticContent={staticContent} />
    </MemoryRouter>
  )

  assert.ok(component, 'The component should exist.')

  const p = getAllTags(component, 'p')

  assert.ok(p.length > 10, 'There should be several paragraphs.')

  assert.end()
})
