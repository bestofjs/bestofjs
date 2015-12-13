import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import getStaticContent from '../staticContent';

//Helpers
import log from '../helpers/log';

// The store is made of 2 "branches", updated by 2 reducers:
// - entities:
// - githubProjects: data coming from Github projects stored in the application

// ======
// PART 1
// ======
function entities(state, action) {
  if(!state) return {
    projects: {},
    tags: {}
  };
  switch (action.type) {
    case 'GET_README_SUCCESS':
    case 'GET_README_FAILURE':
      const id = action.id;
      const projects = Object.assign({}, state.projects);
      const currentProject = Object.assign({}, projects[id]);
      currentProject.readme = action.data.readme;
      const newState = Object.assign({}, state);
      newState.projects[id] = currentProject;
      return newState;
  }
  return state;
}

// ======
// PART 2
// ======

function githubProjects(state, action) {
  log('Running the reducer', action.type);
  if (!state) return {
    lastUpdate: new Date(),
    popularProjectIds: [],
    hotProjectIds: []
  };
  switch (action.type) {
    case 'TOGGLE_MENU':
      //menu.toggle();
      return state;

    default:
      return state;
  }
}


//Let's combine the 2 previous reducers!
const rootReducer = combineReducers({
  entities,
  githubProjects,
  router
});

export default rootReducer;
