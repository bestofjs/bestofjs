import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import entities from './entities';
import githubProjects from './githubProjects';
import auth from './auth';

const rootReducer = combineReducers({
  entities,
  githubProjects,
  auth,
  routing: routerReducer,
  form: formReducer
});

export default rootReducer;
