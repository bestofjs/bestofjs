import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import * as projects from './projects';

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
  switch (action.type) {
    case 'GET_ALL_PROJECTS_SUCCESS':
      const tagsById = {};
      const allProjects = action.data.projects;
      let allTags = action.data.tags;

      allTags.forEach( (tag) => tagsById[tag.code] = tag);

      const populatedProjects = projects.populateTagData(allProjects, tagsById);
      const popularProjects = projects.sortBy(populatedProjects, 'stars');

      return Object.assign({}, state, {
        loading: false,
        allProjects: populatedProjects,
        allTags,
        tagsById,
        lastUpdate: action.data.date,

        popularProjects,
        hotProjects: projects.sortBy(populatedProjects.slice(0), 'delta1'),
        maxStars: (popularProjects.length > 0) ? popularProjects[0].stars : 0
      });
    case '@@reduxReactRouter/routerDidChange':
      if (state.loading) return state;
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
        const id = action.payload.params.id;
        const project = state.allProjects.filter( project => project._id === id );
        return Object.assign({}, state, {
          project: project
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
