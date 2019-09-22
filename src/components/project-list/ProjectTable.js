import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Avatar from '../common/ProjectAvatar'
import StarDelta from '../common/utils/StarDelta'
import StarTotal from '../common/utils/StarTotal'
import { getDeltaByDay } from '../../selectors/project'

const ProjectTable = ({ projects, from = 1, ...otherProps }) => {
  return (
    <Table>
      <tbody>
        {projects.map((project, index) => (
          <ProjectTableRow
            key={project.full_name}
            project={project}
            rank={from + index}
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
  deltaFilter = 'total'
}) => {
  const path = `/projects/${project.slug}`

  const showStars = sortOption.id === 'total'
  const showDelta = ['daily', 'weekly', 'monthly', 'yearly'].includes(
    sortOption.id
  )

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
      </MainCell>

      <LastCell>
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
      </LastCell>
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
  height: 50px;
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
`

const LastCell = styled(Cell)`
  text-align: center;
`

const ProjectName = styled.div`
  font-size: 16px;
  margin-bottom: 0.25rem;
`

const ProjectDescription = styled.span`
  font-size: 14px;
  color: #788080;
`

export default ProjectTable
