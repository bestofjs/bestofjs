import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {getAllTags, getTag, getAllComponents, getComponent} from '../utils';
import setup from '../setup.js';


//Data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';
import getStaticContent from '../../src/staticContent';

const staticContent = getStaticContent();
setup();

//Components to check
import Header from '../../src/components/layout/Header';
import SearchForm from '../../src/components/home/SearchForm';

test('Check <Header> component', (assert) => {

  const component = TestUtils.renderIntoDocument(
    <Header />
  );

  assert.ok(component, `The component should exist.`);

  const inputs = getAllTags(component, 'input');
  assert.equal(inputs.length, 2, 'There should be 2 input fields');

  //The header contains 2 search forms (mobile/desktop)
  const forms = getAllComponents(component, SearchForm);
  assert.equal(forms.length, 2, 'There should be 2 forms');

  const form = forms[1];

  let enteredText = '';
  form.emitChangeDelayed = function (text) {
    enteredText = text;
    assert.equal(enteredText, 'a', 'change event must have been triggered');
    assert.end();
  };

  const input = getTag(form, 'input');
  assert.ok(input, 'There should be one input field');

  const inputNode = ReactDOM.findDOMNode(input);
  //TestUtils.Simulate.keyUp(inputNode, {key: "a", keyCode: 65, which: 65});
  inputNode.value = 'a';
  TestUtils.Simulate.change(inputNode);

});
