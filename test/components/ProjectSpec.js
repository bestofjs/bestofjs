import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {getAllTags, getTag, getAllComponents, getComponent} from '../utils';
import setup from '../setup.js';
import populate from '../../src/helpers/populate';


//Data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';

//Actions
import * as actions from '../../src/actions';

setup();

//Components to check
import Project from '../../src/components/projects/Project';

const state = getInitialState(data);
const {
  entities: { projects, tags },
} = state;

const id = 'react';

let project = projects[id];
project = populate(tags)(project);

test('Check <Project> component', (assert) => {

  const component = TestUtils.renderIntoDocument(
    <Project
      project = { project }
      actions = { actions }
    />
  );

  assert.ok(component, `The component should exist.`);

  const h1 = getTag(component, 'h1');
  const h1Node = ReactDOM.findDOMNode(h1);
  const title = project.name;
  assert.equal(h1Node.innerHTML, title, `Project name '${title}' should be displayed`);

  assert.end();

});
