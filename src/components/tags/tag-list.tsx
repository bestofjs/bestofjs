import React from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import styled from '@emotion/styled'

import { Box, Button, Link, HStack, Flex, Center } from 'components/core'
import { useSelector } from 'containers/project-data-container'
import { getProjectsByTag } from 'selectors'
import { Avatar } from 'components/core/project'
import { ChevronRightIcon } from 'components/core/icons'

export const DetailedTagList = ({ tags }: { tags: BestOfJS.Tag[] }) => {
  return (
    <Box w="100%">
      {tags.map((tag) => (
        <TagListRow key={tag.id} tag={tag} />
      ))}
    </Box>
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
    <Box w="100%">
      {tags.map((tag) => (
        <ListRow key={tag.id}>
          <Flex w="100%" p={4}>
            <Link
              as={RouterLink}
              fontFamily="button"
              to={`/projects?tags=${tag.code}`}
            >
              {tag.name}
            </Link>
            <Box ml={2} color="var(--textSecondaryColor)">
              ({tag.counter})
            </Box>
          </Flex>
        </ListRow>
      ))}
      {footer && (
        <ListRow>
          <Footer>{footer}</Footer>
        </ListRow>
      )}
    </Box>
  )
}

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
        <Center>
          <Link as={RouterLink} to={`/projects?tags=${tag.code}`}>
            {tag.name}
          </Link>
          <Box ml={2}>({tag.counter} projects)</Box>
        </Center>
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
      <HStack>
        {projects.map((project) => (
          <Box key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              as={RouterLink}
              className="hint--top"
              aria-label={project.name}
            >
              <Avatar project={project} size={32} />
            </Link>
          </Box>
        ))}
        <Box>
          <ViewTagButton
            onClick={() => history.push(`/projects?tags=${tag.code}`)}
          >
            <ChevronRightIcon size={16} />
          </ViewTagButton>
        </Box>
      </HStack>
    </div>
  )
}

const breakPoint = 600

const ListRow = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--cardBackgroundColor);
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
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
`

const ViewTagButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
`
