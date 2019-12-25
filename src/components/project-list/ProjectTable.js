import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import numeral from 'numeral'

import { Avatar, DownloadCount, StarDelta, StarTotal } from '../core/project'
import { getDeltaByDay } from '../../selectors/project'
import TagLabelGroup from '../tags/TagLabelGroup'
import { DropdownMenu, Button } from '../core'
import { useUser } from '../../api/hooks'
import fromNow from '../../helpers/fromNow'
import { BookmarkIcon, MarkGitHubIcon, HomeIcon } from '../core/icons'

const ProjectTable = ({ projects, footer, from = 1, ...otherProps }) => {
  const userProps = useUser()

  return (
    <div className="table-container">
      <Table>
        <tbody>
          {projects.map((project, index) => (
            <ProjectTableRow
              key={project.full_name}
              project={project}
              rank={from + index}
              {...userProps}
              {...otherProps}
            />
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <FooterRow>
              <Cell colSpan="5">{footer}</Cell>
            </FooterRow>
          </tfoot>
        )}
      </Table>
    </div>
  )
}
ProjectTable.propTypes = {
  projects: PropTypes.array.isRequired
}

const ProjectTableRow = ({
  project,
  rank,
  sortOption,
  isLoggedIn,
  addBookmark,
  removeBookmark,
  deltaFilter = 'total',
  showDetails = true,
  showRankingNumber = false
}) => {
  const path = `/projects/${project.slug}`

  const showDelta = ['daily', 'weekly', 'monthly', 'yearly'].includes(
    sortOption.id
  )
  const showDownloads = sortOption.id === 'monthly-downloads'
  const showStars = !showDelta && !showDownloads

  const getBookmarkMenuItem = () => {
    if (!isLoggedIn) {
      return { label: 'Add bookmark', icon: <BookmarkIcon />, disabled: true }
    }
    if (project.isBookmark) {
      return {
        label: 'Remove bookmark',
        icon: <BookmarkIcon />,
        onClick: () => removeBookmark(project)
      }
    }
    return {
      label: 'Add bookmark',
      icon: <BookmarkIcon />,
      onClick: () => addBookmark(project)
    }
  }

  const getHomepageMenuItem = () =>
    project.url && {
      icon: <HomeIcon />,
      label: 'Go to homepage',
      url: project.url,
      onClick: () => ({})
    }

  const items = [
    // { type: 'label', label: 'Links' },
    {
      icon: <MarkGitHubIcon />,
      label: 'Go to GitHub repository',
      url: project.repository,
      onClick: () => ({})
    },
    getHomepageMenuItem(),
    { type: 'divider' },
    getBookmarkMenuItem()
  ]

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
        <Avatar project={project} size={50} />
      </IconCell>

      <MainCell>
        <ProjectName>
          <SmallAvatarContainer>
            <Avatar project={project} size={40} />
          </SmallAvatarContainer>
          <Link to={path}>{project.name}</Link>
          {
            <InlineIcon>
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="hint--top"
                aria-label="GitHub repository"
              >
                <MarkGitHubIcon size={20} />
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
                <HomeIcon size={20} />
              </a>
            </InlineIcon>
          )}
          {isLoggedIn &&
            (project.isBookmark ? (
              <IconButton
                on={project.isBookmark}
                onClick={toggleBookmark}
                className="hint--top"
                aria-label="Remove bookmark"
              >
                <BookmarkIcon size={20} />
              </IconButton>
            ) : (
              <IconButton
                on={project.isBookmark}
                onClick={toggleBookmark}
                className="hint--top"
                aria-label="Add bookmark"
              >
                <BookmarkIcon size={20} />
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
          <div style={{ marginBottom: '0.5rem' }}>
            {fromNow(project.pushed_at)}
          </div>
          {formatNumber(project.contributor_count)} contributors
        </ContributorCountCell>
      )}

      <StarNumberCell>
        {showStars && <StarTotal value={project.stars} size={16} />}

        {showDelta && (
          <div className="delta">
            <StarDelta
              value={getDeltaByDay(sortOption.id)(project)}
              average={sortOption.id !== 'daily'}
            />
          </div>
        )}

        {showDownloads && <DownloadCount value={project.downloads} />}
      </StarNumberCell>
      <ActionCell>
        <DropdownMenu items={items} alignment="right" />
      </ActionCell>
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
    border-top: 1px dashed #cecece;
  }
  &:last-child td {
    border-bottom: 1px dashed #cecece;
  }
`

const FooterRow = styled.tr`
  td {
    border-bottom: 1px dashed #cecece;
    text-align: center;
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

const ProjectRankingNumber = styled.div`
  font-size: 24px;
  text-align: center;
  color: #788080;
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

const SmallAvatarContainer = styled.div`
  margin-right: 1rem;
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
  width: 150px;
  @media (max-width: 799px) {
    display: none;
  }
`

const StarNumberCell = styled(Cell)`
  font-size: 1.25rem;
  text-align: center;
  width: 80px;
`

const InlineIcon = styled.span`
  margin-left: 1rem;
  a {
    color: var(--textSecondaryColor);
  }
`

const IconButton = styled(Button)`
  border-style: none;
  border-radius: 50%;
  padding: 0;
  margin-left: 1rem;
  ${props =>
    props.on
      ? css`
          color: #fa9e59;
        `
      : css`
          color: var(--textSecondaryColor);
        `}
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
  font-size: 1.25rem;
  display: flex;
  align-items: center;
`

const ProjectDescription = styled.div`
  font-size: 14px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  @media (min-width: ${breakpoint}px) {
  }
`

const RepoInfo = styled.div`
  margin-top: 0.5rem;
  /*color: #788080;*/
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`

const formatNumber = number => numeral(number).format('a')

export default ProjectTable
