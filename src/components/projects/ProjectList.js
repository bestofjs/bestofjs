import React from 'react'

import ProjectCard from './ProjectCard'
import log from '../../helpers/log'

class ProjectList extends React.Component {
  render() {
    const {
      projects,
      showTags = true,
      showStars = true,
      showDelta = true,
      showDescription = true,
      showURL = false,
      showMetrics = true,
      deltaFilter,
      viewOptions,
      paginated,
      isLoggedin,
      onAddToMyProjects,
      onRemoveFromMyProjects
    } = this.props
    log('Render <ProjectList>', projects.length)
    const paginatedProjects = paginated ? projects.slice(0, 10) : projects
    return (
      <div className="project-grid">
        {paginatedProjects.map((project, index) =>
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
        )}
      </div>
    )
  }
}

export default ProjectList
