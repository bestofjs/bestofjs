import { generatePageNumbers, paginateItemList } from "./helpers";

const defaultInputParams = {
  total: 100,
  limit: 10,
  pageNumberCount: 3,
};

const testCases = [
  {
    input: {
      total: 29,
      currentPageNumber: 1,
    },
    output: {
      pageNumbers: [1, 2, 3],
      from: 1,
      to: 10,
      hasPreviousPage: false,
      hasNextPage: true,
      lastPageNumber: 3,
      isFirstPageIncluded: true,
      isLastPageIncluded: true,
    },
  },
  {
    input: {
      total: 8,
      currentPageNumber: 1,
    },
    output: {
      pageNumbers: [1],
      from: 1,
      to: 8,
      hasPreviousPage: false,
      hasNextPage: false,
      lastPageNumber: 1,
      isFirstPageIncluded: true,
      isLastPageIncluded: true,
    },
  },
  {
    input: {
      total: 100,
      currentPageNumber: 5,
    },
    output: {
      pageNumbers: [4, 5, 6],
      from: 41,
      to: 50,
      hasPreviousPage: true,
      hasNextPage: true,
      lastPageNumber: 10,
      isFirstPageIncluded: false,
      isLastPageIncluded: false,
    },
  },
  // Going to th first page...
  {
    input: {
      total: 100,
      currentPageNumber: 1,
    },
    output: {
      pageNumbers: [1, 2, 3],
      from: 1,
      to: 10,
      hasPreviousPage: false,
      hasNextPage: true,
      lastPageNumber: 10,
      isFirstPageIncluded: true,
      isLastPageIncluded: false,
    },
  },
  {
    input: {
      total: 100,
      currentPageNumber: 2,
    },
    output: {
      pageNumbers: [1, 2, 3],
      from: 11,
      to: 20,
      hasPreviousPage: true,
      hasNextPage: true,
      lastPageNumber: 10,
      isFirstPageIncluded: true,
      isLastPageIncluded: false,
    },
  },
  {
    input: {
      total: 100,
      currentPageNumber: 3,
    },
    output: {
      pageNumbers: [2, 3, 4],
      from: 21,
      to: 30,
      hasPreviousPage: true,
      hasNextPage: true,
      lastPageNumber: 10,
      isFirstPageIncluded: false,
      isLastPageIncluded: false,
    },
  },
  //...going to the last page
  {
    input: {
      total: 100,
      currentPageNumber: 10,
    },
    output: {
      pageNumbers: [8, 9, 10],
      from: 91,
      to: 100,
      hasPreviousPage: true,
      hasNextPage: false,
      lastPageNumber: 10,
      isFirstPageIncluded: false,
      isLastPageIncluded: true,
    },
  },
  {
    input: {
      total: 100,
      currentPageNumber: 9,
    },
    output: {
      pageNumbers: [8, 9, 10],
      from: 81,
      to: 90,
      hasPreviousPage: true,
      hasNextPage: true,
      lastPageNumber: 10,
      isFirstPageIncluded: false,
      isLastPageIncluded: true,
    },
  },
  {
    input: {
      total: 100,
      currentPageNumber: 8,
    },
    output: {
      pageNumbers: [7, 8, 9],
      from: 71,
      to: 80,
      hasPreviousPage: true,
      hasNextPage: true,
      lastPageNumber: 10,
      isFirstPageIncluded: false,
      isLastPageIncluded: false,
    },
  },
];

describe("Pagination unit test", () => {
  it("Should generate page numbers", () => {
    testCases.forEach(({ input, output }) => {
      const actualResult = generatePageNumbers({
        ...defaultInputParams,
        ...input,
      });
      expect(actualResult).toEqual(output);
    });
  });

  it("Should paginate a list of items", () => {
    const items = ["A", "B", "C", "D", "E"];

    expect(paginateItemList(items, 1)).toEqual(items);

    expect(paginateItemList(items, 1, { limit: 2 })).toEqual(["A", "B"]);
    expect(paginateItemList(items, 2, { limit: 2 })).toEqual(["C", "D"]);
    expect(paginateItemList(items, 3, { limit: 2 })).toEqual(["E"]);
  });
});
