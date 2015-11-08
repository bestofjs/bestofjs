import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import getStaticContent from '../staticContent';

//Helpers
import loading from '../loading';
import menu from '../menu';
import track from '../track';

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
function githubProjects(state, action) {
  if (process.env.NODE_ENV === 'development') console.log('Reducer', action.type);
  if (!state) return initialStateProjects;
  switch (action.type) {
    case 'TOGGLE_MENU':
      //menu.toggle();
      return state;
    case 'GET_README_SUCCESS':
      const currentProject = state.project;
      currentProject.readme = action.data.readme;
      return Object.assign({}, state, {
        project: currentProject
      });
    case '@@reduxReactRouter/routerDidChange':

      postNavigationHook();

      let nextState = Object.assign({}, state);
      const routes = action.payload.routes;
      const lastRoute = routes[routes.length - 1];
      if (lastRoute.path === 'tags/:id') {
        const id = action.payload.params.id;
        track('Filter tag', id);
        nextState.tagFilter = state.tagsById[id];
      } else {
        // Reset the current tag (to disactivate the menu item in the sidebar)
        nextState.tagFilter = {code: '*'};
      }
      if (lastRoute.path === 'search/:text') {
        const text = action.payload.params.text;
        nextState.textFilter = text;
      }
      if (lastRoute.path === 'projects/:id') {
        if (state.allProjects.length === 0) return state;
        const id = action.payload.params.id;
        const foundProjects = state.allProjects.filter( project => project._id === id );
        if (!foundProjects.length) return state;
        const project = foundProjects[0];
        track( 'View project', project.name);
        nextState.project = project;
      }
      return nextState;
    default:
      return state;
  }
}

// When a link has been clicked, perform some UI adjustments
// TODO these operation should not be done inside the reducers, that should be "pure" functions!
function postNavigationHook() {

  // navigate to the top of the screen when a route changes
  window.scrollTo(0, 0);

  // Hide the loading indicator
  loading.hide();

  // on mobile screens, hide the side after a link has been clicked
  if (menu.open) menu.hide();
}

//Let's combine the 2 previous reducers!
const rootReducer = combineReducers({
  githubProjects,
  staticContent,
  router
});

export default rootReducer;
