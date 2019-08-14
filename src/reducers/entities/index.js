import { combineReducers } from 'redux'

import projects from './projects'
import tags from './tags'
import heroes from './heroes'
import meta from './meta'

const reducer = combineReducers({
  projects,
  tags,
  heroes,
  meta
})

export default reducer
