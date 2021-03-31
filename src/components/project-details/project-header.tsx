import React from 'react'
import styled from '@emotion/styled'
import { GoHome, GoMarkGithub } from 'react-icons/go'
import { DiNpm } from 'react-icons/di'

import { ButtonLink } from 'components/core'
import { Avatar } from 'components/core/project'
import { TagLabelGroup } from 'components/tags/tag-label'
import formatUrl from 'helpers/url'

type Props = { project: BestOfJS.Project }
export const ProjectHeader = ({ project }: Props) => {
  const { full_name, packageName, repository, url } = project

  return (
    <HeaderLayout>
      <Main>
        <div style={{ paddingRight: '1rem' }}>
          <Avatar project={project} size={75} />
        </div>
        <div style={{ flex: 1 }}>
          <h1>{project.name}</h1>
          <div style={{ margin: '0.5rem 0 0.75rem' }}>
            {project.description}
          </div>
          <div>
            <TagLabelGroup tags={project.tags} />
          </div>
        </div>
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
