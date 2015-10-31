import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {getAllTags, getTag, getAllComponents, getComponent} from '../utils';
import setup from '../setup.js';


//Data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';

//Actions
import * as actions from '../../src/actions';

setup();

//Components to check
import ProjectPage from '../../src/components/projects/ProjectPage';

const state = getInitialState(data);
state.project = state.allProjects[0];


test('Check ProjectPage component', (assert) => {

  const component = TestUtils.renderIntoDocument(
    <ProjectPage
      githubProjects = { state }
      actions = { actions }
    />
  );

  assert.ok(component, `The component should exist.`);

  const h1 = getTag(component, 'h1');
  const h1Node = ReactDOM.findDOMNode(h1);
  const title = state.project.name;
  assert.equal(h1Node.innerHTML, title, `Project title '${title}' should be displayed`);

  assert.end();

});
