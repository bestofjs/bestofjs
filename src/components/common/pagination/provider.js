import React, { createContext } from 'react'

import { generatePageNumbers } from './helpers'

export const PaginationContext = createContext({})

export const PaginationProvider = ({
  total,
  currentPageNumber,
  limit,
  children
}) => {
  const paginationData = generatePageNumbers({
    total,
    currentPageNumber,
    limit
  })

  const value = {
    total,
    currentPageNumber,
    limit,
    ...paginationData
  }

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  )
}
