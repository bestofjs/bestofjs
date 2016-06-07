import React from 'react'
import Link from 'react-router/lib/Link'

import Stars from '../common/utils/Stars'

const ProjectItem = ({ project }) => (
  <div className="project-list-item">
    <div>
      <div style={{ float: 'right' }}>
        <Stars
          value={ project.stars }
          icon
        />
      </div>
      <Link to={`/projects/${project.slug}`}>{project.name}</Link>
    </div>
    <div>
      {project.description}
    </div>
  </div>
)
export default ProjectItem
