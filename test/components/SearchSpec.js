import test from 'tape'
import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import setup from '../setup.js'

setup()

// Components to check
import SearchForm from '../../src/components/home/SearchForm'

test('Check <Search> component', assert => {
  const onChange = sinon.spy()
  const wrapper = mount(<SearchForm onChange={onChange} />)
  assert.ok(wrapper, 'The component should exist.')

  const input = wrapper.find('input')
  assert.equal(input.length, 1, 'There should be 1 input field')

  const change = value =>
    input.simulate('change', {
      target: {
        value
      }
    })

  change('a')
  change('ab')
  change('abc')
  setTimeout(function() {
    assert.ok(onChange.calledOnce, 'onChange handler should be called once')
    // use `onChange.args` to check spy arguments during debugging
    assert.ok(
      onChange.calledWith('abc'),
      'onChange handler should be called with `abc` string'
    )
    assert.end()
  }, 500)
})
