import React from 'react'

import { Avatar } from '../core/project'
import formatUrl from '../../helpers/formatUrl'
import { ExternalLink } from '../core/typography'
import TagLabelGroup from '../tags/TagLabelGroup'

const ProjectHeader = ({ project }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 1rem' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ paddingLeft: '0rem' }}>{project.name}</h1>
        <div
          style={{
            marginTop: '.5rem',
            borderLeft: '2px solid #fa9e59',
            paddingLeft: '1rem'
          }}
        >
          {project.description}{' '}
          {project.url && (
            <ExternalLink url={project.url}>
              {formatUrl(project.url)}
            </ExternalLink>
          )}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <TagLabelGroup tags={project.tags} />
        </div>
      </div>
      <div style={{ fontSize: '1.25rem' }}>
        <Avatar project={project} size={75} />
        {/* <StarTotal value={project.stars} /> */}
      </div>
    </div>
  </div>
)

export default ProjectHeader
