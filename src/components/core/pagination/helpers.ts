export function paginateItemList(itemList, pageNumber, { limit = 10 } = {}) {
  const start = (pageNumber - 1) * limit;
  return itemList.slice(start, start + limit);
}

export function generatePageNumbers({
  total,
  currentPageNumber,
  limit,
  pageNumberCount = 5,
}) {
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
  const isFirstPageIncluded = pageNumbers[0] === 1;
  const isLastPageIncluded = lastPageNumber <= maxPageNumber;

  const from = (currentPageNumber - 1) * limit + 1;
  const to = Math.min(from + limit - 1, total);

  return {
    pageNumbers,
    from,
    to,
    hasPreviousPage,
    hasNextPage,
    lastPageNumber,
    isFirstPageIncluded,
    isLastPageIncluded,
  };
}

const times = (n) => [...Array(n).keys()].map((i) => i + 1);
