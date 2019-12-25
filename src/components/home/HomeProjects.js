import React from 'react'
import { Link } from 'react-router-dom'

import ProjectList from '../project-list/ProjectTable'

const HomeProjects = ({ hotProjects, hotFilter }) => {
  return (
    <>
      <ProjectList
        projects={hotProjects}
        showDelta
        deltaFilter={hotFilter}
        showStars={false}
        showIndex
        showMetrics={false}
        sortOption={{ id: 'daily' }}
        showDetails={false}
        showRankingNumber={true}
        footer={
          <Link to={`/projects?sort=daily`} style={{ display: 'block' }}>
            View full rankings »
          </Link>
        }
      />
    </>
  )
}

export default HomeProjects
