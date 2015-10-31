import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import axios from 'axios';

import {getAllTags, getTag} from '../utils';
import setup from '../setup.js';


//Data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';
import getStaticContent from '../../src/staticContent';

const staticContent = getStaticContent();
setup();

//Components to check
import AboutPage from '../../src/components/about/About';
import Button from '../../src/components/common/StarMeButton';

test('Star on Github button', (assert) => {

  const component = TestUtils.renderIntoDocument(
    <Button
      url = { staticContent.repo }
    />
  );

  assert.ok(component, `The component should exist.`);

  const a = getTag(component, 'a');
  const node = ReactDOM.findDOMNode(a);
  const url = node.href;

  assert.ok((/michaelrambeau/).test(url), "It should be one of my repositories.");

  // http request to check the repository
  axios.get(url)
    .then( r => {
        assert.ok( r.status === 200, "Github response should be OK" );
        assert.end();
    })
    .catch( err => {
      assert.fail('Bad response!', err.message);
      assert.end();
    } );

});

test('Check About page', (assert) => {

  const state = getInitialState(data);

  const component = TestUtils.renderIntoDocument(
    <AboutPage
      githubProjects = { state }
      staticContent = { staticContent }
    />
  );

  assert.ok(component, `The component should exist.`);

  const p = getAllTags(component, 'p');

  assert.ok(p.length > 10, `There should be several paragraphs.`);

  const a = getAllTags(component, 'a');
  const nodes = a.map( (tag) => ReactDOM.findDOMNode(tag) );
  const urls = nodes.map( (node) => node.innerHTML );

  assert.end();
});
