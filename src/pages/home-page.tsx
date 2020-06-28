import React from 'react'

import { getNewestProjects, getPopularTags } from 'selectors'
import { Home } from 'components/home/home'
import { ProjectDataContainer } from 'containers/project-data-container'

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
