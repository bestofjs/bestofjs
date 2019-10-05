import React, { useContext } from 'react'
import styled from 'styled-components'
// import PropTypes from 'prop-types'
import useReactRouter from 'use-react-router'

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
  showBookmarkSortOption,
  children
}) => {
  const { from, pageNumbers } = useContext(PaginationContext)
  const { location, history } = useReactRouter()

  const onChangeSortOption = sortId => {
    const changes = { sort: sortId, page: 1 }
    const nextLocation = updateLocation(location, changes)

    history.push(nextLocation)
  }

  return (
    <div>
      <Row>
        <Cell>
          {children}
          {pageNumbers.length > 1 && (
            <PaginationTopBar history={history} location={location} />
          )}
        </Cell>
        <Cell style={{ flex: '0 0 50%' }}>
          <SortOrderPicker
            onChange={onChangeSortOption}
            value={sortOption.id}
            showBookmark={showBookmarkSortOption}
          />
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
  margin-bottom: 1rem;
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
    <SubTitle>
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
      Showing{' '}
      {from === to ? (
        `#${from}`
      ) : (
        <>
          {from} - {to} of {total}
        </>
      )}
    </SubTitle>
  )
}

const SubTitle = styled.div`
  margin-top: 0.5rem;
  color: #788080;
  fontsize: 16px;
  display: flex;
  align-items: center;
`

const PaginationButton = styled(Button)`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 0;
  margin-right: 0.25rem;
`
