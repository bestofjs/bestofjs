export type PaginationState = {
  from: number;
  to: number;
  limit: number;
  currentPageNumber: number;
  total: number;
  pageNumbers: number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  lastPageNumber: number;
};

export function computePaginationState({
  total,
  currentPageNumber,
  limit,
}: {
  total: number;
  currentPageNumber: number;
  limit: number;
}) {
  const pageNumberCount = 5;
  const numberOfPages = Math.ceil(total / limit);
  const allPageNumbers = times(numberOfPages);
  const lastPageNumber = allPageNumbers[allPageNumbers.length - 1];
  let delta = Math.floor(pageNumberCount / 2);

  let minPageNumber = currentPageNumber - delta;
  let maxPageNumber = currentPageNumber + delta;

  if (minPageNumber < 1) {
    minPageNumber = 1;
    maxPageNumber = pageNumberCount;
  }
  if (maxPageNumber > lastPageNumber) {
    maxPageNumber = lastPageNumber;
    minPageNumber = Math.max(lastPageNumber - pageNumberCount + 1, 1);
  }

  const pageNumbers = allPageNumbers.slice(minPageNumber - 1, maxPageNumber);
  const hasPreviousPage = currentPageNumber > 1;
  const hasNextPage = currentPageNumber < lastPageNumber;

  const from = (currentPageNumber - 1) * limit + 1;
  const to = Math.min(from + limit - 1, total);

  return {
    from,
    to,
    hasPreviousPage,
    hasNextPage,
    pageNumbers,
    lastPageNumber,
    currentPageNumber,
    total,
    limit
  };
}


// @ts-ignore
const times = (n: number) => [...Array(n).keys()].map((i) => i + 1);
