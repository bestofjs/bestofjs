import test from 'tape';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../src/reducers';



// Main components to test
import HomePage from '../../src/containers/HomePage';

// Sub components
import Button from '../../src/components/common/StarMeButton';
import ProjectList from '../../src/components/projects/ProjectList';
import ProjectCard from '../../src/components/projects/ProjectCard';

import {getAllTags, getTag, getAllComponents} from '../utils';

import setup from '../setup.js';
setup();

//Data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';

test('Check <HomePage> container', (assert) => {

  const state = getInitialState(data);
  const store = createStore(rootReducer, state);

  const component = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  assert.ok(component, `The component should exist.`);

  const button = getAllComponents(component, Button);
  const lists = getAllComponents(component, ProjectList);

  assert.equal(button.length, 1, `There should be one "Star on Github" button.`);
  assert.equal(lists.length, 2, `There should be 2 lists of projects.`);

  const projects = getAllComponents(component, ProjectCard);
  assert.equal(projects.length, 40, `There should be 40 projects.`);

  assert.end();
});
