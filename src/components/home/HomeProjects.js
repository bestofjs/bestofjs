import React from 'react'

import ProjectList from '../projects/ProjectList'

const viewOptions = {
  description: true,
  npms: false,
  packagequality: false,
  commit: false
}

const HomeProjects = ({
  hotProjects,
  popularProjects,
  maxStars,
  isLoggedin,
  uiActions,
  hotFilter,
  showMetrics
}) => (
  <ProjectList
    projects={hotProjects}
    showDelta
    deltaFilter={hotFilter}
    showStars={false}
    showIndex
    showMetrics={false}
    viewOptions={viewOptions}
  />
)

export default HomeProjects
