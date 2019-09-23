import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Avatar from '../common/ProjectAvatar'
import StarDelta from '../common/utils/StarDelta'
import StarTotal from '../common/utils/StarTotal'
import { getDeltaByDay } from '../../selectors/project'
import TagLabelGroup from '../tags/TagLabelGroup'
import { DropdownMenu } from '../core'

import Octicon, { Bookmark, MarkGithub, Home } from '@primer/octicons-react'
import { useUser } from '../../api/hooks'

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
  deltaFilter = 'total'
}) => {
  const path = `/projects/${project.slug}`

  const showStars = sortOption.id === 'total'
  const showDelta = ['daily', 'weekly', 'monthly', 'yearly'].includes(
    sortOption.id
  )

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
      <FirstCell>
        <ProjectRankingNumber>{rank}</ProjectRankingNumber>
      </FirstCell>

      <IconCell>
        <Avatar project={project} size={50} />
      </IconCell>

      <MainCell>
        <ProjectName>
          <Link to={path}>{project.name}</Link>
        </ProjectName>
        <ProjectDescription>{project.description}</ProjectDescription>
        <div>
          <TagLabelGroup tags={project.tags} />
        </div>
      </MainCell>

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
      {isLoggedIn && (
        <BookmarkCell
          style={{ color: project.isBookmark ? '#e65100' : '#ececec' }}
        >
          <Octicon>
            <Bookmark />
          </Octicon>
        </BookmarkCell>
      )}
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
  height: 120px;
  padding: 8px 0;
  background-color: white;
`

const ProjectRankingNumber = styled.div`
  width: 50px;
  font-size: 24px;
  text-align: center;
  color: #788080;
`

const FirstCell = styled(Cell)`
  width: 50px;
`

const IconCell = styled(Cell)`
  width: 50px;
`

const MainCell = styled(Cell)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StarNumberCell = styled(Cell)`
  text-align: center;
`

const BookmarkCell = styled(Cell)`
  padding: 8px;
`

const ActionCell = styled(Cell)`
  padding-right: 1rem;
`

const ProjectName = styled.div`
  font-size: 16px;
`

const ProjectDescription = styled.div`
  font-size: 14px;
  color: #788080;
`

export default ProjectTable
