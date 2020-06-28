// import React, { createContext } from 'react'

import { generatePageNumbers } from './helpers'
import { createContainer } from 'unstated-next'

// export const PaginationContext = createContext({})

function usePaginationState({ currentPageNumber, limit, total }) {
  const paginationData = generatePageNumbers({
    total,
    currentPageNumber,
    limit
  })

  return {
    total,
    currentPageNumber,
    limit,
    ...paginationData
  }
}

export const PaginationContainer = createContainer(usePaginationState)
