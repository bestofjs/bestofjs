import React from 'react'

import ProjectCard from './ProjectCard'
import log from '../../helpers/log'

const belongsToMyProjects = project => !!project.belongsToMyProjects
const getMyProjects = projects => projects.filter(belongsToMyProjects)
const getPendingProject = projects => {
  const found = projects.find(project => !!project.pending)
  return found && found.slug
}

function checkIfDifferent(list0, list1) {
  if (list0.length !== list1.length) return true
  if (getMyProjects(list1).join() !== getMyProjects(list0).join()) return true
  if (getPendingProject(list0) !== getPendingProject(list1)) return true // to show loading during pending requests
  return !list0.every((project, i) => project.slug === list1[i].slug)
}

class ProjectList extends React.Component {
  shouldComponentUpdate(nextProps) {
    // Re-render the project list only if the project list has changed or if the loggin status has changed
    if (nextProps.isLoggedin !== this.props.isLoggedin) return true
    // to avoid rendering after fetch events about heroes, links, reviews and requests
    return checkIfDifferent(this.props.projects, nextProps.projects)
  }
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
