import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { reducer as formReducer } from 'redux-form';

import entities from './entities';
import githubProjects from './githubProjects';
import auth from './auth';

const rootReducer = combineReducers({
  entities,
  githubProjects,
  auth,
  router,
  form: formReducer
});

export default rootReducer;
