export type PaginationState = {
  from: number;
  to: number;
  limit: number;
  numberOfPages: number;
  page: number;
  total: number;
  pageNumbers: number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  lastPageNumber: number;
};

export function computePaginationState({
  total,
  page,
  limit,
}: {
  total: number;
  page: number;
  limit: number;
}): PaginationState {
  const pageNumberCount = 5;
  const numberOfPages = Math.ceil(total / limit);
  const allPageNumbers = times(numberOfPages);
  const lastPageNumber = allPageNumbers[allPageNumbers.length - 1];
  const delta = Math.floor(pageNumberCount / 2);

  let minPageNumber = page - delta;
  let maxPageNumber = page + delta;

  if (minPageNumber < 1) {
    minPageNumber = 1;
    maxPageNumber = pageNumberCount;
  }
  if (maxPageNumber > lastPageNumber) {
    maxPageNumber = lastPageNumber;
    minPageNumber = Math.max(lastPageNumber - pageNumberCount + 1, 1);
  }

  const pageNumbers = allPageNumbers.slice(minPageNumber - 1, maxPageNumber);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < lastPageNumber;

  const from = (page - 1) * limit + 1;
  const to = Math.min(from + limit - 1, total);

  return {
    from,
    to,
    hasPreviousPage,
    hasNextPage,
    pageNumbers,
    numberOfPages,
    lastPageNumber,
    page,
    total,
    limit,
  };
}

function times(n: number) {
  return Array.from(Array(n).keys()).map((i) => i + 1);
}
