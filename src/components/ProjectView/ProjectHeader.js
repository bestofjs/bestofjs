import React from 'react'
import numeral from 'numeral'

import StarIcon from '../common/utils/StarIcon'

const formatNumber = number => numeral(number).format('0,0')

const ProjectHeader = ({ project }) =>
  <div
    style={{ display: 'flex', alignItems: 'center', margin: '0 0 1rem' }}
    className="no-card-container"
  >
    <h1 style={{ flex: '1' }}>
      {project.name}
    </h1>
    <div style={{ fontSize: '1.25rem' }}>
      {formatNumber(project.stars)}
      <StarIcon />
    </div>
  </div>

export default ProjectHeader
