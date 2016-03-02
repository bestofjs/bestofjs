import { combineReducers } from 'redux';

import projects from './projects';
import crud from './crud';
import tags from './tags';

const reducer = combineReducers({
  projects,
  tags,
  links: crud('link'),
  reviews: crud('review')
});

export default reducer;
