import test from 'tape';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

var jsdom = require('../setup.js');


//data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';

import staticContent from '../../src/staticContent';

jsdom();

var AboutPage = require('../../src/components/about/About');

test('Check About page', (assert) => {

  const state = getInitialState(data);

  var component = TestUtils.renderIntoDocument(
    <AboutPage
      githubProjects = { state }
      staticContent = { staticContent }
    />
  );

  assert.ok(component, true, `The component should exist.`);
  assert.end();
});
