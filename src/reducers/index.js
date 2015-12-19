import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import entities from './entities';
import githubProjects from './githubProjects';

// The store is made of 2 "branches", updated by 2 reducers:
// - entities:
// - githubProjects: data coming from Github projects stored in the application

const rootReducer = combineReducers({
  entities,
  githubProjects,
  router
});

export default rootReducer;
