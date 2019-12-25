import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { getProjectsByTag } from '../../selectors/index'
import { Avatar } from '../core/project'
import { Button, Grid, Cell as GridCell } from '../core'
import { ChevronRightIcon } from '../core/icons'

export const TagList = ({ tags }) => {
  return (
    <List>
      {tags.map(tag => (
        <TagListRow key={tag.id} tag={tag} />
      ))}
    </List>
  )
}

const TagListRow = ({ tag }) => {
  return (
    <ListRow>
      <MainListCell>
        <div>
          <Link
            to={`/projects?tags=${tag.code}`}
            style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}
          >
            {tag.name}
          </Link>{' '}
          ({tag.counter} projects)
        </div>
        {tag.description && (
          <p style={{ marginTop: '1rem' }} className="text-secondary">
            {tag.description}
          </p>
        )}
      </MainListCell>
      <ProjectIconCell>
        <IconGrid tag={tag} />
      </ProjectIconCell>
    </ListRow>
  )
}

const IconGrid = ({ tag, projectCount = 5 }) => {
  const history = useHistory()
  const projects = useSelector(
    getProjectsByTag({ tagId: tag.id, criteria: 'total' })
  ).slice(0, projectCount)

  return (
    <div>
      <Grid>
        {projects.map(project => (
          <GridCell key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              className="hint--top"
              aria-label={project.name}
            >
              <Avatar project={project} size={32} />
            </Link>
          </GridCell>
        ))}
        <GridCell>
          <ViewTagButton
            onClick={() => history.push(`/projects?tags=${tag.code}`)}
          >
            <ChevronRightIcon size={16} />
          </ViewTagButton>
        </GridCell>
      </Grid>
    </div>
  )
}

const List = styled.div`
  width: 100%;
`

const breakPoint = 600

const ListRow = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-top: 1px dashed #cecece;
  &:last-child {
    border-bottom: 1px dashed #cecece;
  }
  @media (max-width: ${breakPoint - 1}px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const ListCell = styled.div`
  padding: 1rem;
`

const MainListCell = styled(ListCell)`
  @media (max-width: ${breakPoint - 1}px) {
    padding-bottom: 0;
  }
`

const ProjectIconCell = styled(ListCell)`
  min-width: 300px;
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
`

const ViewTagButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
`
