import { combineReducers } from 'redux';

import projects from './projects';
import links from './links';
import tags from './tags';

const reducer = combineReducers({
  projects,
  tags,
  links
});

export default reducer;
