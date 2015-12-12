import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import getStaticContent from '../staticContent';

//Helpers
import loading from '../loading';
import menu from '../menu';
import track from '../track';
import log from '../helpers/log';

function entities(state, action) {
  return state;
}

// The store is made of 2 "branches", updated by 2 reducers:
// - staticContent: some static content shated by all components
// - githubProjects: data coming from Github projects stored in the application

// ======
// PART 1
// ======

//The 1st reducer
//A reducer that always return the same state... it could be refactored in another way!
function staticContent() {
  return getStaticContent();
}

// ======
// PART 2
// ======

//The default state
const initialStateProjects = {
  loading: true,
  allProjects: [],
  allTags: [],
  tagsById: null,
  popularProjects: [],
  hotProjects: [],
  lastUpdate: new Date(),
  tagFilter: {
    code: '*'
  },
  textFilter: '',
  project: null
};

//The 2nd reducer
function githubProjects(state = {}, action) {
  log('Running the reducer', action.type);
  if (!state) return initialStateProjects;
  switch (action.type) {
    case 'TOGGLE_MENU':
      //menu.toggle();
      return state;
    case 'GET_README_SUCCESS':
      const id = action.id;
      const projects = Object.assign({}, state.entities.projects);
      const currentProject = Object.assign({}, projects[id]);
      currentProject.readme = action.data.readme;
      const newState = Object.assign({}, state);
      newState.entities.projects[id] = currentProject;
      return newState;
    default:
      return state;
  }
}


//Let's combine the 2 previous reducers!
const rootReducer = combineReducers({
  githubProjects,
  staticContent,
  router
});

export default rootReducer;
