import React from 'react'

// import ProjectList from '../projects/ConnectedProjectList'
import ProjectList from '../project-list/ProjectTable'

const viewOptions = {
  description: true,
  npms: false,
  packagequality: false,
  commit: false
}

const HomeProjects = ({ hotProjects, hotFilter }) => (
  <ProjectList
    projects={hotProjects}
    showDelta
    deltaFilter={hotFilter}
    showStars={false}
    showIndex
    showMetrics={false}
    viewOptions={viewOptions}
    sortOption={{ id: 'daily' }}
    showDetails={false}
  />
)

export default HomeProjects
