import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import numeral from 'numeral'

import Avatar from '../common/ProjectAvatar'
import StarDelta from '../common/utils/StarDelta'
import StarTotal from '../common/utils/StarTotal'
import { getDeltaByDay } from '../../selectors/project'
import TagLabelGroup from '../tags/TagLabelGroup'
import { DropdownMenu } from '../core'
import { useUser } from '../../api/hooks'
import fromNow from '../../helpers/fromNow'
import { BookmarkIcon, MarkGitHubIcon, HomeIcon } from '../core/icons'

const ProjectTable = ({ projects, from = 1, ...otherProps }) => {
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
  const showStars = !showDelta

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
            <Avatar project={project} size={32} />
          </SmallAvatarContainer>
          <Link to={path}>{project.name}</Link>
          {isLoggedIn && (
            <InlineIcon>
              <BookmarkIcon
                size={24}
                color={project.isBookmark ? '#fa9e59' : '#ececec'}
              />
            </InlineIcon>
          )}
          {
            <InlineIcon>
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MarkGitHubIcon size={20} />
              </a>
            </InlineIcon>
          }
          {project.url && (
            <InlineIcon>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <HomeIcon size={20} />
              </a>
            </InlineIcon>
          )}
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

const Cell = styled.td`
  padding: 0.5rem;
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
  margin-right: 0.5rem;
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
  /*color: #788080;*/
`

const StarNumberCell = styled(Cell)`
  font-size: 1.25rem;
  text-align: center;
  width: 80px;
`

const InlineIcon = styled.span`
  margin-left: 0.5rem;
  a {
    color: #bbb;
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
  font-size: 16px;
  display: flex;
  align-items: center;
`

const ProjectDescription = styled.div`
  font-size: 14px;
  margin-bottom: 0.5rem;
  @media (min-width: ${breakpoint}px) {
    margin-top: 0.5rem;
  }
`

const RepoInfo = styled.div`
  margin-top: 0.5rem;
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`

const formatNumber = number => numeral(number).format('a')

export default ProjectTable
