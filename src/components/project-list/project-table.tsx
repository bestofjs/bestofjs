import React, { CSSProperties } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import numeral from 'numeral'
import { GoMarkGithub, GoBookmark, GoHome } from 'react-icons/go'

import { getDeltaByDay } from 'selectors'
import { AuthContainer } from 'containers/auth-container'
import {
  Avatar,
  DownloadCount,
  StarDelta,
  StarTotal
} from 'components/core/project'
import { TagLabelGroup } from 'components/tags/tag-label'
import { Button } from 'components/core'
import { fromNow } from 'helpers/from-now'
import { ProjectDetailsButton } from './project-details-button'

type Props = {
  projects: BestOfJS.Project[]
  footer?: React.ReactNode
  from?: number
  style?: CSSProperties
  sortOption?: any
  showDetails?: boolean
  showActions?: boolean
  metricsCell?: (project: BestOfJS.Project) => React.ReactNode
}
export const ProjectTable = ({
  projects,
  footer,
  from = 1,
  style,
  sortOption,
  ...otherProps
}: Props) => {
  return (
    <div className="table-container" style={style}>
      <Table>
        <tbody>
          {projects.map((project, index) => {
            if (!project) return null
            return (
              <ProjectTableRow
                key={project.full_name}
                project={project}
                rank={from + index}
                sortOption={sortOption}
                {...otherProps}
              />
            )
          })}
        </tbody>
        {footer && (
          <tfoot>
            <FooterRow>
              <Cell colSpan={5}>{footer}</Cell>
            </FooterRow>
          </tfoot>
        )}
      </Table>
    </div>
  )
}

type RowProps = {
  project: BestOfJS.Project
  rank: number
  sortOption: any
  deltaFilter?: string
  showDetails?: boolean
  showRankingNumber?: boolean
  showActions?: boolean
  metricsCell?: (project: BestOfJS.Project) => React.ReactNode
}
const ProjectTableRow = ({
  project,
  rank,
  sortOption,
  deltaFilter = 'total',
  showDetails = true,
  showRankingNumber = false,
  showActions = true,
  metricsCell
}: RowProps) => {
  const {
    isLoggedIn,
    addBookmark,
    removeBookmark
  } = AuthContainer.useContainer()
  const path = `/projects/${project.slug}`

  const showDelta = ['daily', 'weekly', 'monthly', 'yearly'].includes(
    sortOption.id
  )
  const showDownloads = sortOption.id === 'monthly-downloads'
  const showStars = !showDelta && !showDownloads

  const toggleBookmark = () => {
    project.isBookmark ? removeBookmark(project) : addBookmark(project)
  }

  return (
    <Row>
      {showRankingNumber && (
        <FirstCell>
          <ProjectRankingNumber>{rank}</ProjectRankingNumber>
        </FirstCell>
      )}

      <IconCell>
        <Link to={path}>
          <Avatar project={project} size={50} />
        </Link>
      </IconCell>

      <MainCell>
        <ProjectName>
          <MainLink to={path}>
            <ProjectIconSmallScreen project={project} size={40} />
            {project.name}
          </MainLink>
          {
            <InlineIcon>
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="hint--top"
                aria-label="GitHub repository"
              >
                <GoMarkGithub size={20} />
              </a>
            </InlineIcon>
          }
          {project.url && (
            <InlineIcon>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hint--top"
                aria-label="Project's homepage"
              >
                <GoHome size={20} />
              </a>
            </InlineIcon>
          )}
          {isLoggedIn &&
            (project.isBookmark ? (
              <IconButton
                isHighlighted={project.isBookmark}
                onClick={toggleBookmark}
                className="hint--top"
                aria-label="Remove bookmark"
              >
                <GoBookmark size={20} />
              </IconButton>
            ) : (
              <IconButton
                on={project.isBookmark}
                onClick={toggleBookmark}
                className="hint--top"
                aria-label="Add bookmark"
              >
                <GoBookmark size={20} />
              </IconButton>
            ))}
        </ProjectName>
        <ProjectDescription>
          {project.description}
          <RepoInfo>
            Updated {fromNow(project.pushed_at)},{' '}
            {formatNumber(project.contributor_count)} contributors
          </RepoInfo>
        </ProjectDescription>
        <div>
          <TagLabelGroup tags={project.tags} />
        </div>
      </MainCell>

      {showDetails && (
        <ContributorCountCell>
          <div>Pushed {fromNow(project.pushed_at)}</div>
          {project.contributor_count && (
            <div>{formatNumber(project.contributor_count)} contributors</div>
          )}
          <>Created {fromNow(project.created_at)}</>
        </ContributorCountCell>
      )}

      {metricsCell ? (
        <StarNumberCell>{metricsCell(project)}</StarNumberCell>
      ) : (
        <StarNumberCell>
          {showStars && <StarTotal value={project.stars} size={20} />}

          {showDelta && (
            <div className="delta">
              <StarDelta
                value={getDeltaByDay(sortOption.id)(project)}
                average={sortOption.id !== 'daily'}
                size={20}
              />
            </div>
          )}

          {showDownloads && <DownloadCount value={project.downloads} />}
        </StarNumberCell>
      )}

      {showActions && (
        <ActionCell>
          <ProjectDetailsButton project={project} isLoggedIn={isLoggedIn} />
        </ActionCell>
      )}
    </Row>
  )
}

const breakpoint = 800

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
`

const Row = styled.tr`
  td {
    border-top: 1px dashed var(--boxBorderColor);
  }
  &:last-child td {
    border-bottom: 1px dashed var(--boxBorderColor);
  }
`

const FooterRow = styled.tr`
  td {
    border-bottom: 1px dashed var(--boxBorderColor);
    text-align: center;
    a {
      display: block;
      font-family: var(--buttonFontFamily);
    }
  }
`

const Cell = styled.td`
  padding: 1rem 0.5rem;
  background-color: white;
  &:first-of-type {
    padding-left: 1rem;
  }
`

const ProjectRankingNumber = styled.div`
  font-size: 24px;
  text-align: center;
  color: var(--textSecondaryColor);
`

const FirstCell = styled(Cell)`
  width: 50px;
  @media (max-width: ${breakpoint - 1}px) {
    display: none;
  }
`

const IconCell = styled(Cell)`
  width: 50px;
  @media (max-width: ${breakpoint - 1}px) {
    display: none;
  }
`

const MainLink = styled(Link)`
  display: flex;
  align-items: center;
  img {
    margin-right: 1rem;
  }
  font-family: var(--buttonFontFamily);
`

const ProjectIconSmallScreen = styled(Avatar)`
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`

const MainCell = styled(Cell)`
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const ContributorCountCell = styled(Cell)`
  width: 170px;
  @media (max-width: 799px) {
    display: none;
  }
  div {
    margin-bottom: 0.5rem;
  }
`

const StarNumberCell = styled(Cell)`
  text-align: center;
  width: 85px;
`

const InlineIcon = styled.span`
  margin-left: 1rem;
  a {
    color: var(--textSecondaryColor);
  }
`

type IconButtonProps = {
  on?: boolean
  isHighlighted?: boolean
}
const IconButton = styled(Button)<IconButtonProps>`
  border-style: none;
  border-radius: 50%;
  padding: 0;
  margin-left: 1rem;
  color: ${props =>
    props.isHighlighted
      ? 'var(--textSecondaryColor);'
      : 'var(--textMutedColor);'}
  &:hover {
    color: var(--bestofjsPurple);
  }
`

const ActionCell = styled(Cell)`
  width: 45px;
  padding-right: 1rem;
  @media (max-width: ${breakpoint - 1}px) {
    display: none;
  }
`

const ProjectName = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-family: var(--linkFontFamily);
`

const ProjectDescription = styled.div`
  font-size: 14px;
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
  @media (min-width: ${breakpoint}px) {
  }
`

const RepoInfo = styled.div`
  margin-top: 0.5rem;
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`

const formatNumber = number => numeral(number).format('a')
