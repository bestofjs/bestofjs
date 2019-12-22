import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { getProjectsByTag } from '../../selectors/index'
import { Avatar } from '../core/project'
import { Grid, Cell as GridCell } from '../core'

export const TagList = ({ tags }) => {
  return (
    <Table>
      <tbody>
        {tags.map(tag => (
          <TagListRow key={tag.id} tag={tag} />
        ))}
      </tbody>
    </Table>
  )
}

const TagListRow = ({ tag }) => {
  return (
    <Row>
      <Cell>
        <div style={{ marginBottom: '1rem' }}>
          <Link
            to={`/projects?tags=${tag.code}`}
            style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}
          >
            {tag.name}
          </Link>{' '}
          ({tag.counter} projects)
        </div>
        {tag.description && (
          <p style={{ marginBottom: '1rem' }}>{tag.description}</p>
        )}
        <IconGrid tag={tag} />
      </Cell>
    </Row>
  )
}

const IconGrid = ({ tag, projectCount = 10 }) => {
  const projects = useSelector(
    getProjectsByTag({ tagId: tag.id, criteria: 'total' })
  ).slice(0, projectCount)
  return (
    <div>
      <Grid>
        {projects.map(project => (
          <GridCell key={project.slug}>
            <Avatar project={project} size={32} />
          </GridCell>
        ))}
      </Grid>
    </div>
  )
}

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
`

const Row = styled.tr`
  td {
    border-top: 1px dashed #cecece;
  }
  &:last-child td {
    border-bottom: 1px dashed #cecece;
  }
`

const Cell = styled.td`
  padding: 1rem;
  background-color: white;
  &:first-child {
    padding-left: 1rem;
  }
  .icon {
    color: #fa9e59;
    margin-right: 0.25rem;
  }
`
