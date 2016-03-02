import test from 'tape';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../src/reducers';

// Main components to test
import getHomePage from '../../src/containers/HomePage';

// Sub components
import Button from '../../src/components/common/StarMeButton';
import ProjectList from '../../src/components/projects/ProjectList';
import ProjectCard from '../../src/components/projects/ProjectCard';

import { getAllComponents } from '../utils';
import {
  mount,
  render
} from 'enzyme';

import setup from '../setup.js';
setup();

// Data
import data from '../data/projects';
import { getInitialState } from '../../src/projectData';

test('Check <HomePage> container', (assert) => {
  const TOP_PROJECT_COUNT = 20;
  const HomePage = getHomePage(TOP_PROJECT_COUNT);
  const state = getInitialState(data);
  console.log(data.projects.length, Object.keys(state));
  const store = createStore(rootReducer, state);

  const component = mount(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  assert.ok(component, `The component should exist.`);

  const button = component.find(Button);
  const Lists = component.find(ProjectList);

  assert.equal(button.length, 1, `There should be one "Star on Github" button.`);
  assert.equal(Lists.length, 2, `There should be 2 lists of projects.`);

  if (false) Lists.forEach(List => {
    // it does not work with "stateless" components! TODO fix it!
    const projects = List.find(ProjectCard);
    assert.equal(projects.length, TOP_PROJECT_COUNT, `There should be ${TOP_PROJECT_COUNT} projects.`);
  });

  assert.end();
});
