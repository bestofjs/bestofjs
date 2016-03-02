import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import entities from './entities';
import githubProjects from './githubProjects';
import auth from './auth';

const rootReducer = combineReducers({
  entities,
  githubProjects,
  auth,
  routing: routeReducer,
  form: formReducer
});

export default rootReducer;
