import setup from '../setup.js';
setup();

import test from 'tape';
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from '../../src/reducers';

// Main components to test
import ProjectPage from '../../src/containers/ProjectPage';

import { getAllTags, getTag, getAllComponents } from '../utils';

import { fetchReadme } from '../../src/actions';

import {
  mount
} from 'enzyme';
import sinon from 'sinon';

// Data
import data from '../data/projects';
import { getInitialState } from '../../src/projectData';

const id = '56a95b5843bdc81100111331';

test('Check <ProjectPage> container', (assert) => {
  const state1 = getInitialState(data);
  const routing = {
    path: `/projects/${id}`
  };
  const state2 = Object.assign({}, state1, { routing });

  const finalCreateStore = compose(applyMiddleware(thunk))(createStore);
  const store = finalCreateStore(rootReducer, state2);

  const unsubscribe = store.subscribe(() => {
    const { name, readme } = store.getState().entities.projects[id];
    if (readme) {
      assert.ok(readme.length > 1000, `There should be a pretty long readme in the project`);
    } else {
      // assert.fail('No readme found!')
    }
  });

  console.log(ProjectPage.prototype);
  sinon.spy(ProjectPage.prototype, 'componentWillReceiveProps');
  const component = mount(
    <Provider store={store}>
      <ProjectPage params={{ id }} />
    </Provider>
  );
  assert.ok(ProjectPage.prototype.componentWillReceiveProps, 'componentWillReceiveProps should have been called');

  assert.ok(component, `The component should exist.`);

  assert.end();
});
