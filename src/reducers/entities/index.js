import { combineReducers } from 'redux'

import projects from './projects'
import crud from './crud'
import tags from './tags'
import heroes from './heroes'
import meta from './meta'

const reducer = combineReducers({
  projects,
  tags,
  links: crud('link'),
  reviews: crud('review'),
  heroes,
  meta
})

export default reducer
