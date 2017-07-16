import React from 'react'

import ProjectList from '../projects/ConnectedProjectList'

const viewOptions = {
  description: true,
  npms: false,
  packagequality: false,
  commit: false
}

const HomeProjects = ({ hotProjects, hotFilter }) =>
  <ProjectList
    projects={hotProjects}
    showDelta
    deltaFilter={hotFilter}
    showStars={false}
    showIndex
    showMetrics={false}
    viewOptions={viewOptions}
  />

export default HomeProjects
