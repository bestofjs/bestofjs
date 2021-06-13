import React from 'react'
import styled from '@emotion/styled'
import { useHistory, useLocation } from 'react-router-dom'

import { ProjectTable } from 'components/project-list/project-table'
import { PaginationContainer } from 'components/core/pagination/provider'
import { SortOrderPicker } from './sort-order-picker'
import { updateLocation } from './search-utils'
import {
  TopPaginationControls,
  BottomPaginationControls
} from '../core/pagination/pagination-controls'

export const ProjectPaginatedList = ({
  projects,
  page,
  total,
  limit,
  sortOption
}) => {
  const { from, pageNumbers } = PaginationContainer.useContainer()
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
        <Row>
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
              <TopPaginationControls history={history} location={location} />
            </Cell>
          )}
        </Row>
      )}
      <ProjectTable projects={projects} from={from} sortOption={sortOption} />
      {showPagination && (
        <BottomPaginationControls history={history} location={location} />
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
