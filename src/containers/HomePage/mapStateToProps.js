import { getPopularTags, getHotProjects } from '../../selectors'

function mapStateToProps (state, count) {
  const {
    auth,
    ui
  } = state

  const hot = getHotProjects(state)
  const popularTags = getPopularTags(state)

  return {
    hotProjects: hot,
    popularTags,
    auth,
    ui
  }
}

export default mapStateToProps
