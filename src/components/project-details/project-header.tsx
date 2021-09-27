import React from 'react'
import styled from '@emotion/styled'
import { GoHome, GoMarkGithub } from 'react-icons/go'
import { DiNpm } from 'react-icons/di'

import {
  Box,
  Button,
  LinkProps,
  ButtonProps,
  Heading,
  VStack
} from 'components/core'
import { usePageTitle } from 'components/core'
import { Avatar } from 'components/core/project'
import { ProjectTagGroup } from 'components/tags/project-tag'
import formatUrl from 'helpers/url'

type Props = { project: BestOfJS.Project }
export const ProjectHeader = ({ project }: Props) => {
  const { full_name, packageName, repository, url } = project

  usePageTitle(project.name)

  return (
    <HeaderLayout>
      <Main>
        <Box pr={4}>
          <Avatar project={project} size={75} />
        </Box>
        <VStack spacing={4} alignItems="flex-start">
          <Heading fontSize="2rem" lineHeight="1">
            {project.name}
          </Heading>
          <Box>{project.description}</Box>
          <Box>
            <ProjectTagGroup tags={project.tags} />
          </Box>
        </VStack>
      </Main>
      <QuickLinks>
        <ButtonLink href={repository}>
          <GoMarkGithub size={20} className="icon" />
          <span>{full_name}</span>
        </ButtonLink>
        {url && (
          <ButtonLink href={url}>
            <GoHome size={20} className="icon" />
            <span>{formatUrl(url)}</span>
          </ButtonLink>
        )}
        {packageName && (
          <ButtonLink href={`https://www.npmjs.com/package/${packageName}`}>
            <DiNpm
              size={28}
              className="icon"
              style={{ transform: 'translateY(2px)' }}
            />
            <span>{packageName}</span>
          </ButtonLink>
        )}
      </QuickLinks>
    </HeaderLayout>
  )
}

const breakpoint = 800

const HeaderLayout = styled.div`
  display: flex;
  margin-bottom: 1rem;
  flex-direction: column;
  margin-bottom: 2rem;
  @media (min-width: ${breakpoint}px) {
    flex-direction: row;
    align-items: center;
  }
`

const Main = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-height: 120px;
  @media (min-width: ${breakpoint}px) {
    padding-right: 1rem;
    border-right: 1px dashed var(--iconColor);
  }
`

const QuickLinks = styled.aside`
  position: relative;
  margin-top: 1rem;
  @media (min-width: ${breakpoint}px) {
    width: 280px;
    margin-top: 0;
    padding-left: 1rem;
  }
  > * {
    width: 100%;
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
  span {
    padding-left: 36px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  a {
    justify-content: flex-start;
  }
  .icon {
    position: absolute;
  }
`

const ButtonLink = (props: ButtonProps & LinkProps) => (
  <Button as="a" variant="outline" w="100%" {...props} />
)
