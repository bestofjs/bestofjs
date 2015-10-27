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
      menu.toggle();
      return state;
    case 'GET_README_SUCCESS':
      const currentProject = state.project;
      currentProject.readme = action.data.readme;
      return Object.assign({}, state, {
        project: currentProject
      });
    case '@@reduxReactRouter/routerDidChange':
      //if (state.loading) return state;
      window.scrollTo(0, 0);
      loading.hide();
      menu.hide();
      const routes = action.payload.routes;
      const lastRoute = routes[routes.length - 1];
      if (lastRoute.path === 'tags/:id') {
        const id = action.payload.params.id;
        track('Filter tag', id);
        return Object.assign({}, state, {
          tagFilter: state.tagsById[id]
        });
      }
      if (lastRoute.path === 'search/:text') {
        const text = action.payload.params.text;
        return Object.assign({}, state, {
          textFilter: text
        });
      }
      if (lastRoute.path === 'projects/:id') {
        if (state.allProjects.length === 0) return state;
        const id = action.payload.params.id;
        const foundProjects = state.allProjects.filter( project => project._id === id );
        if (!foundProjects.length) return state;
        const project = foundProjects[0];
        track( 'View project', project.name);
        return Object.assign({}, state, {
          project
        });
      }
      return state;
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
