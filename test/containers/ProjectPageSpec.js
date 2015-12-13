import setup from '../setup.js';
setup();

import test from 'tape';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from '../../src/reducers';

// Main components to test
import ProjectPage from '../../src/containers/ProjectPage';

import {getAllTags, getTag, getAllComponents} from '../utils';

import { fetchReadme } from '../../src/actions';

import {
  mount,
  spyLifecycle
} from 'enzyme';


//Data
import data  from '../data/projects';
import {getInitialState} from '../../src/projectData';

test('Check <ProjectPage> container', (assert) => {

  const state1 = getInitialState(data);
  const router = {
    params: {
      id: 'react'
    }
  };
  const state2 = Object.assign({}, state1, { router });

  const finalCreateStore = compose(applyMiddleware(thunk))(createStore);
  const store = finalCreateStore(rootReducer, state2);

  let unsubscribe = store.subscribe(() => {
      const {name, readme} = store.getState().entities.projects.react;
      if (readme) {
        assert.ok(readme.length > 1000, `There should be a pretty long readme in the project`);
        assert.end();
      }
  });


  spyLifecycle(ProjectPage);
  const component = mount(
    <Provider store={store}>
      <ProjectPage />
    </Provider>
  );
  assert.ok(ProjectPage.prototype.componentDidMount.calledOnce, 'componentDidMount should have been called');

  assert.ok(component, `The component should exist.`);

});
