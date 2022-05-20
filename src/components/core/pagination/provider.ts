// import React, { createContext } from 'react'

import { generatePageNumbers } from "./helpers";
import { createContainer } from "unstated-next";

// export const PaginationContext = createContext({})

interface usePagingStateType {
  currentPageNumber: number;
  limit: number;
  total: number;
}

interface PaginationDataType extends usePagingStateType {
  pageNumbers: number[];
  from: number;
  to: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  lastPageNumber: number;
  isFirstPageIncluded: boolean;
  isLastPageIncluded: boolean;
}

function usePaginationState({
  currentPageNumber,
  limit,
  total,
}: usePagingStateType): PaginationDataType {
  const paginationData = generatePageNumbers({
    total,
    currentPageNumber,
    limit,
  });

  return {
    total,
    currentPageNumber,
    limit,
    ...paginationData,
  };
}

export const PaginationContainer = createContainer<
  PaginationDataType,
  usePagingStateType
  // @ts-expect-error There might be issue with the type definition of unstated-next
>(usePaginationState);
