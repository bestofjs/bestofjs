import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

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
      />
      <div style={{ paddingTop: '2rem' }}>
        <Button onClick={showMore} style={{ display: 'block', width: '100%' }}>
          View full rankings »
        </Button>
      </div>
    </>
  )
}

export default HomeProjects
