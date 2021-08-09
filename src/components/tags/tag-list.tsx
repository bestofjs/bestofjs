import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from '@emotion/styled'

import { useSelector } from 'containers/project-data-container'
import { getProjectsByTag } from 'selectors'
import { Avatar } from 'components/core/project'
import { Button, Grid, Cell as GridCell } from 'components/core'
import { ChevronRightIcon } from 'components/core/icons'

export const DetailedTagList = ({ tags }: { tags: BestOfJS.Tag[] }) => {
  return (
    <TagList>
      {tags.map(tag => (
        <TagListRow key={tag.id} tag={tag} />
      ))}
    </TagList>
  )
}

export const CompactTagList = ({
  tags,
  footer
}: {
  tags: BestOfJS.Tag[]
  footer?: React.ReactNode
}) => {
  return (
    <TagList>
      {tags.map(tag => (
        <ListRow key={tag.id}>
          <CompactListItem>
            <StyledLink to={`/projects?tags=${tag.code}`}>
              {tag.name}
            </StyledLink>
            ({tag.counter})
          </CompactListItem>
        </ListRow>
      ))}
      {footer && (
        <ListRow>
          <Footer>{footer}</Footer>
        </ListRow>
      )}
    </TagList>
  )
}

const StyledLink = styled(Link)`
  margin-right: 0.25rem;
  font-family: var(--buttonFontFamily);
`

const CompactListItem = styled.div`
  width: 100%;
  padding: 1rem;
`

const Footer = styled.div`
  width: 100%;
  padding: 1rem;
  font-family: var(--buttonFontFamily);
  text-align: center;
`

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

const TagList = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`

const breakPoint = 600

const ListRow = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-top: 1px dashed var(--boxBorderColor);
  &:last-child {
    border-bottom: 1px dashed var(--boxBorderColor);
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
