import React from 'react'

const ProjectHeader = ({ project }) => (
  <h1 style={{ margin: '0 0 1rem' }} className="no-card-container">
    {project.name}
  </h1>
)

export default ProjectHeader
