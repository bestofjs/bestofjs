import React, { useContext } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'

import {
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '../core/icons'
import ProjectTable from '../project-list/ProjectTable'
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

  const showPagination = pageNumbers.length > 1
  const showSortOptions = total > 1

  return (
    <div>
      {(showSortOptions || showPagination) && (
        <Row style={{ borderTop: '1px dashed #cecece' }}>
          <Cell>
            {showSortOptions && (
              <SortOrderPicker
                onChange={onChangeSortOption}
                value={sortOption.id}
              />
            )}
          </Cell>
          {showPagination && (
            <Cell>
              <TopPaginationContainer history={history} location={location} />
            </Cell>
          )}
        </Row>
      )}
      <ProjectTable
        projects={projects}
        showStars={false}
        from={from}
        sortOption={sortOption}
      />
      {showPagination && (
        <BottomPaginationContainer history={history} location={location} />
      )}
    </div>
  )
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  @media (min-width: 600px) {
    align-items: center;
    flex-direction: row;
  }
`
const Cell = styled.div`
  flex: 0 0 50%;
  padding-top: 1rem;
  @media (min-width: 600px) {
    > div:last-child {
      justify-content: flex-end;
    }
  }
`

const iconSize = 28

const TopPaginationContainer = ({ history, location }) => {
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
        alignItems: 'center'
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
        <ChevronLeftIcon size={iconSize} />
      </PaginationButton>
      <PaginationButton
        disabled={!hasNextPage}
        onClick={() =>
          history.push(
            updateLocation(location, { page: currentPageNumber + 1 })
          )
        }
      >
        <ChevronRightIcon size={iconSize} />
      </PaginationButton>
    </div>
  )
}

const BottomPaginationContainer = ({ history, location }) => {
  const {
    currentPageNumber,
    hasPreviousPage,
    hasNextPage,
    lastPageNumber,
    pageNumbers
  } = useContext(PaginationContext)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2rem'
      }}
    >
      {pageNumbers.length > 2 && (
        <PaginationButton
          disabled={currentPageNumber === 1}
          onClick={() => history.push(updateLocation(location, { page: 1 }))}
        >
          <DoubleChevronLeftIcon size={iconSize} />
        </PaginationButton>
      )}

      <PaginationButton
        disabled={!hasPreviousPage}
        onClick={() =>
          history.push(
            updateLocation(location, { page: currentPageNumber - 1 })
          )
        }
      >
        <ChevronLeftIcon size={iconSize} />
      </PaginationButton>

      <PaginationButton
        disabled={!hasNextPage}
        onClick={() =>
          history.push(
            updateLocation(location, { page: currentPageNumber + 1 })
          )
        }
      >
        <ChevronRightIcon size={iconSize} />
      </PaginationButton>

      {pageNumbers.length > 2 && (
        <PaginationButton
          disabled={currentPageNumber === lastPageNumber}
          onClick={() =>
            history.push(updateLocation(location, { page: lastPageNumber }))
          }
        >
          <DoubleChevronRightIcon size={iconSize} />
        </PaginationButton>
      )}
    </div>
  )
}

const PaginationButton = styled(Button)`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  margin-right: 0.5rem;
`
