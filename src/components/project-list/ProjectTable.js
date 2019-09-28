import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import numeral from 'numeral'
import Octicon, {
  Bookmark,
  GitCommit,
  MarkGithub,
  Home,
  Organization
} from '@primer/octicons-react'

import Avatar from '../common/ProjectAvatar'
import StarDelta from '../common/utils/StarDelta'
import StarTotal from '../common/utils/StarTotal'
import { getDeltaByDay } from '../../selectors/project'
import TagLabelGroup from '../tags/TagLabelGroup'
import { DropdownMenu } from '../core'
import { useUser } from '../../api/hooks'
import fromNow from '../../helpers/fromNow'

const ProjectTable = ({ projects, from = 1, ...otherProps }) => {
  const userProps = useUser()

  return (
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
    const icon = (
      <Octicon>
        <Bookmark />
      </Octicon>
    )
    if (!isLoggedIn) {
      return { label: 'Add bookmark', icon, disabled: true }
    }
    if (project.isBookmark) {
      return {
        label: 'Remove bookmark',
        icon,
        onClick: () => removeBookmark(project)
      }
    }
    return { label: 'Add bookmark', icon, onClick: () => addBookmark(project) }
  }

  const getHomepageMenuItem = () =>
    project.url && {
      icon: (
        <Octicon>
          <Home />
        </Octicon>
      ),
      label: 'Homepage',
      url: project.url,
      onClick: () => ({})
    }

  const items = [
    // { type: 'label', label: 'Links' },
    {
      icon: (
        <Octicon>
          <MarkGithub />
        </Octicon>
      ),
      label: 'GitHub',
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
          <Link to={path}>{project.name}</Link>
          {isLoggedIn && (
            <BookmarkIconContainer on={project.isBookmark}>
              <Octicon size={24}>
                <Bookmark />
              </Octicon>
            </BookmarkIconContainer>
          )}
        </ProjectName>
        <ProjectDescription>{project.description}</ProjectDescription>
        <div>
          <TagLabelGroup tags={project.tags} />
        </div>
      </MainCell>

      {/* <LastCommitCell>{fromNow(project.pushed_at)}</LastCommitCell> */}
      {showDetails && (
        <ContributorCountCell>
          <div style={{ marginBottom: '0.5rem' }}>
            <Octicon className="icon">
              <GitCommit />
            </Octicon>
            {fromNow(project.pushed_at)}
          </div>
          <Octicon className="icon">
            <Organization />
          </Octicon>
          {formatNumber(project.contributor_count)} contributors
        </ContributorCountCell>
      )}

      <StarNumberCell>
        {showStars && (
          <div className="total">
            <StarTotal value={project.stars} icon />
          </div>
        )}

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
  @media (max-width: 799px) {
    display: none;
  }
`

const IconCell = styled(Cell)`
  width: 50px;
`

const MainCell = styled(Cell)`
  padding: 16px;
  display: flex;
  flex-direction: column;
`

// const LastCommitCell = styled(Cell)`
//   width: 110px;
// `

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

const BookmarkIconContainer = styled.span`
  margin-left: 0.5rem;
  ${({ on }) =>
    on
      ? css`
          color: var(--bestofjsOrange);
        `
      : css`
          color: #ececec;
        `}
`

const ActionCell = styled(Cell)`
  padding-right: 1rem;
`

const ProjectName = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
`

const ProjectDescription = styled.div`
  font-size: 14px;
  margin: 8px 0;
`

const formatNumber = number => numeral(number).format('a')

export default ProjectTable
