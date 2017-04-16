import React from 'react'
import ProjectCard from './ProjectCard'

const ProjectList = ({ projects, showTags = true, showStars = true, showDelta = true, showDescription = true, showURL = false, showMetrics = true, deltaFilter, viewOptions }) => {
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
export default ProjectList
