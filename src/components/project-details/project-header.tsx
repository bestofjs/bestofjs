import React from 'react'

import { Avatar } from '../core/project'
import formatUrl from '../../helpers/formatUrl'
import { ExternalLink } from '../core/typography'
import { TagLabelGroup } from '../tags/tag-label'

type Props = { project: BestOfJS.Project }
export const ProjectHeader = ({ project }: Props) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 1rem' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ paddingLeft: '0rem' }}>{project.name}</h1>
        <div
          style={{
            marginTop: '.5rem',
            borderLeft: '2px solid var(--iconColor)',
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
      </div>
    </div>
  </div>
)
