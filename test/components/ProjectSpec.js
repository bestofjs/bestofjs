import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {
  mount,
  render,
  shallow
} from 'enzyme';

import { getAllTags, getTag, getAllComponents, getComponent } from '../utils';
import setup from '../setup.js';
import populate from '../../src/helpers/populate';


// Data
import data from '../data/projects';
import { getInitialState } from '../../src/projectData';

// Actions
import * as actions from '../../src/actions';

setup();

// Components to check
import Project from '../../src/components/projects/ProjectCard';

const state = getInitialState(data);
const {
  entities: { projects, tags },
} = state;

const id = '55723c9f4140883353bc773e';

let project = projects[id];
console.log('Project to check', project);
project = populate(tags)(project);

test('Check <Project> component', (assert) => {
  const component = shallow(
    <Project
      project = { project }
      actions = { actions }
    />
  );

  assert.ok(component, `The component should exist.`);

  const header = component.find('header');
  const title = project.name;
  assert.ok(header.html().indexOf(title) > -1, `Project name '${title}' should be displayed in the header`);

  assert.end();
});
