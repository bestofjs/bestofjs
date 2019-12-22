import React, { useContext } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'

import { PaginationContext } from '../core/pagination/provider'
import { SortOrderPicker } from './sort-order'
import { updateLocation } from '../search/search-utils'

import { TagList } from './tag-list'
import {
  TopPaginationControls,
  BottomPaginationControls
} from '../core/pagination/pagination-controls'

export const PaginatedTagList = ({
  tags,
  query,
  page,
  total,
  limit,
  sortOptionId
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
                value={sortOptionId}
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
      <TagList tags={tags} from={from} />
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
