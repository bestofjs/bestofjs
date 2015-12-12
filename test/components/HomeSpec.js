import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {getAllTags, getTag, getAllComponents} from '../utils';
import setup from '../setup.js';


//Data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';
import getStaticContent from '../../src/staticContent';

const staticContent = getStaticContent();
setup();

//Components to check
import Home from '../../src/components/home/Home';
import Button from '../../src/components/common/StarMeButton';
import ProjectList from '../../src/components/projects/ProjectList';
import ProjectCard from '../../src/components/projects/ProjectCard';

import populate from '../../src/helpers/populate';

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    hotProjectIds,
    popularProjectIds
  } = state.githubProjects;

  const hotProjects = hotProjectIds
    .map( id => projects[id] )
    .slice(0, 20)
    .map( populate(tags) );
  const popularProjects = popularProjectIds
    .map( id => projects[id] )
    .slice(0, 20)
    .map( populate(tags) );

  return {
    hotProjects,
    popularProjects
  };
}


test('Check <Home> component', (assert) => {

  const state = {githubProjects: getInitialState(data)};

  const props = mapStateToProps(state);

  const component = TestUtils.renderIntoDocument(
    <Home
      hotProjects = { props.hotProjects }
      popularProjects = { props.popularProjects }
    />
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
