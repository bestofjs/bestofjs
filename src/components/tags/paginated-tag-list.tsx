import React from 'react'
import styled from '@emotion/styled'
import { useHistory, useLocation } from 'react-router-dom'

import { PaginationContainer } from 'components/core/pagination/provider'
import { updateLocation } from 'components/search/search-utils'
import {
  TopPaginationControls,
  BottomPaginationControls
} from 'components/core/pagination/pagination-controls'
import { TagListSortOrderPicker } from './tag-list-sort-order'
import { DetailedTagList } from './tag-list'

export const PaginatedTagList = ({
  tags,
  page,
  total,
  limit,
  sortOptionId
}) => {
  const { pageNumbers } = PaginationContainer.useContainer()
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
              <TagListSortOrderPicker
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
      <DetailedTagList tags={tags} />
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
  @media (min-width: 600px) {
    > div:last-child {
      justify-content: flex-end;
    }
  }
`
