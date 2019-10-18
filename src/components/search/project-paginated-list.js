import React, { useContext } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
// import PropTypes from 'prop-types'

import { ChevronRightIcon, ChevronLeftIcon } from '../core/icons'
import ProjectTable from '../project-list/ProjectTable'
import PaginationControls from '../common/pagination/PaginationControls'
import { PaginationContext } from '../common/pagination/provider'
import { Button } from '../core'
import { SortOrderPicker } from './sort-order'
import { updateLocation } from './search-utils'

export const ProjectPaginatedList = ({
  projects,
  query,
  page,
  total,
  limit,
  sortOption,
  children
}) => {
  const { from, pageNumbers } = useContext(PaginationContext)
  const location = useLocation()
  const history = useHistory()

  const onChangeSortOption = sortId => {
    const changes = { sort: sortId, page: 1 }
    const nextLocation = updateLocation(location, changes)

    history.push(nextLocation)
  }

  return (
    <div>
      <Row style={{ borderTop: '1px dashed #cecece' }}>
        <Cell>
          {projects.length > 1 && (
            <SortOrderPicker
              onChange={onChangeSortOption}
              value={sortOption.id}
            />
          )}
        </Cell>
        <Cell>
          {pageNumbers.length > 1 && (
            <PaginationTopBar history={history} location={location} />
          )}
        </Cell>
      </Row>
      <ProjectTable
        projects={projects}
        showStars={false}
        from={from}
        sortOption={sortOption}
      />
      <PaginationControls total={total} currentPage={page} limit={limit} />
    </div>
  )
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 700px) {
    align-items: center;
    flex-direction: row;
  }
`
const Cell = styled.div`
  flex: 0 0 50%;
  padding-top: 1rem;
  margin-bottom: 1rem;
  &:last-child {
    justify-content: flex-end;
  }
`

const PaginationTopBar = ({ history, location }) => {
  const {
    from,
    to,
    currentPageNumber,
    total,
    hasPreviousPage,
    hasNextPage
  } = useContext(PaginationContext)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0.5rem 0'
      }}
    >
      <div style={{ marginRight: '1rem' }}>
        Showing{' '}
        {from === to ? (
          `#${from}`
        ) : (
          <>
            {from} - {to} of {total}
          </>
        )}
      </div>
      <PaginationButton
        disabled={!hasPreviousPage}
        onClick={() =>
          history.push(
            updateLocation(location, { page: currentPageNumber - 1 })
          )
        }
      >
        <ChevronLeftIcon size={24} />
      </PaginationButton>
      <PaginationButton
        disabled={!hasNextPage}
        onClick={() =>
          history.push(
            updateLocation(location, { page: currentPageNumber + 1 })
          )
        }
      >
        <ChevronRightIcon size={24} />
      </PaginationButton>
    </div>
  )
}

// const SubTitle = styled.div`
//   margin-top: 0.5rem;
//   color: #788080;
//   fontsize: 16px;
//   display: flex;
//   align-items: center;
// `

const PaginationButton = styled(Button)`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 0;
  margin-right: 0.25rem;
`
