import React from 'react'

import { getNewestProjects, getPopularTags } from '../selectors'
import { Home } from '../components/home/home'
import { ProjectDataContainer } from 'containers/project-list-container'

// const HomePage = ({ auth, ui, pending, ...otherProps }) => {
//   return <Home pending={auth.pending || pending} {...otherProps} />
// }

// function mapStateToProps(state) {
//   const { auth, ui } = state

//   const tagCount = 10
//   const popularTags = getPopularTags(tagCount)(state)

//   const newestProjectCount = 5
//   const newestProjects = getNewestProjects(newestProjectCount)(state)

//   const { pending, error } = state.entities.meta
//   return { newestProjects, popularTags, auth, ui, pending, error }
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     authActions: {}
//   }
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(HomePage)

const HomePage = () => {
  const state = ProjectDataContainer.useContainer()

  const tagCount = 10
  const popularTags = getPopularTags(tagCount)(state)

  const newestProjectCount = 5
  const newestProjects = getNewestProjects(newestProjectCount)(state)

  return (
    <Home
      pending={state.isPending}
      popularTags={popularTags}
      newestProjects={newestProjects}
    />
  )
}

export default HomePage
