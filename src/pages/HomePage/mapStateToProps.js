import { getPopularTags, getHotProjects } from '../../selectors'

function mapStateToProps(state, count) {
  const { auth, ui } = state
  const hot = getHotProjects(count)(state)
  const popularTags = getPopularTags(state)
  const pending = state.entities.meta.pending
  return {
    hotProjects: hot,
    popularTags,
    auth,
    ui,
    pending
  }
}

export default mapStateToProps
