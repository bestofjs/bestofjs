import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'

// import ProjectList from '../projects/ConnectedProjectList'
import ProjectList from '../project-list/ProjectTable'
import { Button } from '../core'

const HomeProjects = ({ hotProjects, hotFilter }) => {
  const history = useHistory()
  const showMore = useCallback(
    () => {
      history.push(`/projects?sort=daily`)
    },
    [history]
  )

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
