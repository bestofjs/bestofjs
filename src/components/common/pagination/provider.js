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
  return (
    <PaginationContext.Provider value={paginationData}>
      {children}
    </PaginationContext.Provider>
  )
}
