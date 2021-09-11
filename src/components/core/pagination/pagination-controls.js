import React from 'react'
import { Box, ButtonGroup, Flex, IconButton } from '@chakra-ui/react'

import {
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '../icons'
import { updateLocation } from '../../search/search-utils'
import { PaginationContainer } from './provider'

const iconSize = 28

export const TopPaginationControls = ({ history, location }) => {
  const {
    from,
    to,
    currentPageNumber,
    total,
    hasPreviousPage,
    hasNextPage
  } = PaginationContainer.useContainer()

  return (
    <Flex alignItems="center">
      <Box mr={4}>
        Showing{' '}
        {from === to ? (
          `#${from}`
        ) : (
          <>
            {from} - {to} of {total}
          </>
        )}
      </Box>
      <ButtonGroup>
        <PaginationButton
          isDisabled={!hasPreviousPage}
          onClick={() =>
            history.push(
              updateLocation(location, { page: currentPageNumber - 1 })
            )
          }
        >
          <ChevronLeftIcon size={iconSize} />
        </PaginationButton>
        <PaginationButton
          isDisabled={!hasNextPage}
          onClick={() =>
            history.push(
              updateLocation(location, { page: currentPageNumber + 1 })
            )
          }
        >
          <ChevronRightIcon size={iconSize} />
        </PaginationButton>
      </ButtonGroup>
    </Flex>
  )
}

export const BottomPaginationControls = ({ history, location }) => {
  const {
    currentPageNumber,
    hasPreviousPage,
    hasNextPage,
    lastPageNumber,
    pageNumbers
  } = PaginationContainer.useContainer()

  return (
    <ButtonGroup mt={8} w="100%" justifyContent="flex-end">
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
    </ButtonGroup>
  )
}

const PaginationButton = props => (
  <IconButton variant="outline" isRound {...props} />
)
