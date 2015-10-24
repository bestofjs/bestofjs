import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

function staticContent() {
  return {
    projectName: 'bestof.js.org',
    repo: 'https://github.com/michaelrambeau/bestofjs-webui'
  };
}

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

function githubProjects(state, action) {
  if (!state) return initialStateProjects;
  console.log('Reducer', action.type);
  switch (action.type) {
    case 'GET_README_SUCCESS':
      const currentProject = state.project;
      currentProject.readme = action.data.readme;
      return Object.assign({}, state, {
        project: currentProject
      });
    case '@@reduxReactRouter/routerDidChange':
      //if (state.loading) return state;
      window.scrollTo(0, 0);
      const routes = action.payload.routes;
      const lastRoute = routes[routes.length - 1];
      if (lastRoute.path === 'tags/:id') {
        const id = action.payload.params.id;
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
        return Object.assign({}, state, {
          project: foundProjects.length ? foundProjects[0] : null
        });
      }
      return state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  githubProjects,
  staticContent,
  router
});

export default rootReducer;
