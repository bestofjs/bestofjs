import React from 'react'
import styled from 'styled-components'

import ProjectCard from './ProjectCard'
import log from '../../helpers/log'

const gutter = `2rem`

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: -${gutter};
  margin-left: -${gutter};
  > div {
    width: 50%;
    padding: ${gutter} 0 0 ${gutter};
    display: flex;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    > div {
      flex: 0 0 auto;
      width: 100%;
    }
  }
`

class ProjectList extends React.Component {
  render() {
    const {
      projects,
      showTags = true,
      showStars = true,
      showDelta = true,
      showDescription = true,
      showURL = false,
      showMetrics = false,
      deltaFilter,
      viewOptions,
      items,
      isLoggedin,
      onAddToMyProjects,
      onRemoveFromMyProjects
    } = this.props
    const paginatedProjects = items || projects
    log('Render <ProjectList>', paginatedProjects.length)
    return (
      <Grid>
        {paginatedProjects.map((project, index) => (
          <div key={project.slug}>
            <ProjectCard
              project={project}
              index={index}
              showTags={showTags}
              showDescription={showDescription}
              showStars={showStars}
              showDelta={showDelta}
              deltaFilter={deltaFilter}
              showURL={showURL}
              showMetrics={showMetrics}
              viewOptions={viewOptions}
              isLoggedin={isLoggedin}
              onAddToMyProjects={onAddToMyProjects}
              onRemoveFromMyProjects={onRemoveFromMyProjects}
            />
          </div>
        ))}
      </Grid>
    )
  }
}

export default ProjectList
