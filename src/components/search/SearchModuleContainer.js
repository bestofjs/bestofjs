import { connect } from 'react-redux'

import { SearchModule } from './SearchModule'
import { getAllTags, allProjects } from '../../selectors'

function mapStateToProps(state) {
  const tags = getAllTags(state)
  const projects = allProjects(state)
  return {
    tags,
    projects
  }
}

export const SearchModuleContainer = connect(mapStateToProps)(SearchModule)
