import React from 'react'
import ProjectCard from './ProjectCard'

class ProjectList extends React.Component {
  shouldComponentUpdate () {
    // Never re-render the project list
    // to avoid rendering after successful login, and fetch events about heroes, links, reviews and requests
    return false
  }
  render () {
    const {
      projects,
      showTags = true,
      showStars = true,
      showDelta = true,
      showDescription = true,
      showURL = false,
      showMetrics = true,
      deltaFilter,
      viewOptions
    } = this.props
    console.info('Render the list', projects[0])
    return (
      <div className="project-grid">
      {projects.map((project, index) =>
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
          />
        </div>)
      }
      </div>
    )
  }
}

export default ProjectList
