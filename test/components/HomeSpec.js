import test from 'tape';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {
  mount,
  render,
  shallow
} from 'enzyme';

import {getAllTags, getTag, getAllComponents} from '../utils';
import setup from '../setup.js';


// Data
import data from '../data/projects';
import { getInitialState } from '../../src/projectData';

setup();

// Components to check
import Home from '../../src/components/home/Home';
import Button from '../../src/components/common/StarMeButton';
import ProjectList from '../../src/components/projects/ProjectList';
import ProjectCard from '../../src/components/projects/ProjectCard';

import populate from '../../src/helpers/populate';

function mapStateToProps(state) {
  const {
    entities: { projects, tags },
    githubProjects: {
      hotProjectIds,
      popularProjectIds
    }
  } = state;

  const hotProjects = hotProjectIds
    .map(id => projects[id])
    .slice(0, 20)
    .map(populate(tags));
  const popularProjects = popularProjectIds
    .map(id => projects[id])
    .slice(0, 20)
    .map(populate(tags));

  return {
    hotProjects,
    popularProjects
  };
}

test('Check <ProjectList>', assert => {
  const count = 20;
  const state = getInitialState(data);
  const {
    entities: { projects, tags },
    githubProjects: {
      hotProjectIds
    }
  } = state;
  const hotProjects = hotProjectIds
    .map(id => projects[id])
    .slice(0, count)
    .map(populate(tags));

  const component = shallow(
    <ProjectList
      projects = { hotProjects }
    />
  );
  assert.ok(component, `The component should exist.`);
  // console.log(component.debug());
  const foundProjects = component.find(ProjectCard);
  assert.equal(foundProjects.length, count, `There should be N projects.`);
  assert.end();
});

test('Check <Home> component', (assert) => {
  const state = getInitialState(data);

  const props = mapStateToProps(state);
  console.log(props.hotProjects.length);

  const component = shallow(
    <Home
      hotProjects = { props.hotProjects }
      popularProjects = { props.popularProjects }
    />
  );

  assert.ok(component, `The component should exist.`);
  console.log(component.debug());

  const button = component.find(Button);
  const lists = component.find(ProjectList);

  assert.equal(button.length, 1, `There should be one "Star on Github" button.`);
  assert.equal(lists.length, 2, `There should be 2 lists of projects.`);

  assert.end();
});
