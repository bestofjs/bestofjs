import { combineReducers } from 'redux';

import projects from './projects';
import links from './links';
import reviews from './reviews';
import tags from './tags';

const reducer = combineReducers({
  projects,
  tags,
  links,
  reviews
});

export default reducer;
