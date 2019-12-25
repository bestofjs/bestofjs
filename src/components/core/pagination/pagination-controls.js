import React, { useContext } from 'react'
import styled from 'styled-components'

import {
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '../icons'
import { Button } from '../button'
import { PaginationContext } from './provider'
import { updateLocation } from '../../search/search-utils'
const iconSize = 28

export const TopPaginationControls = ({ history, location }) => {
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

export const BottomPaginationControls = ({ history, location }) => {
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
