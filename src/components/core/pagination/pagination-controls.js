import { Box, HStack, Flex, IconButton } from "components/core";

import {
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "../icons";
import { useNextLocation } from "components/search/search-utils";
import { PaginationContainer } from "./provider";

const iconSize = 28;

export const TopPaginationControls = () => {
  const { from, to, currentPageNumber, total, hasPreviousPage, hasNextPage } =
    PaginationContainer.useContainer();
  const { navigate } = useNextLocation();

  return (
    <Flex alignItems="center">
      <Box mr={4}>
        Showing{" "}
        {from === to ? (
          `#${from}`
        ) : (
          <>
            {from} - {to} of {total}
          </>
        )}
      </Box>
      <HStack>
        <PaginationButton
          isDisabled={!hasPreviousPage}
          onClick={() => navigate({ page: currentPageNumber - 1 })}
        >
          <ChevronLeftIcon size={iconSize} />
        </PaginationButton>
        <PaginationButton
          isDisabled={!hasNextPage}
          onClick={() => navigate({ page: currentPageNumber + 1 })}
        >
          <ChevronRightIcon size={iconSize} />
        </PaginationButton>
      </HStack>
    </Flex>
  );
};

export const BottomPaginationControls = () => {
  const {
    currentPageNumber,
    hasPreviousPage,
    hasNextPage,
    lastPageNumber,
    pageNumbers,
  } = PaginationContainer.useContainer();
  const { navigate } = useNextLocation();

  return (
    <HStack mt={8} w="100%" justifyContent="flex-end">
      {pageNumbers.length > 2 && (
        <PaginationButton
          disabled={currentPageNumber === 1}
          onClick={() => navigate({ page: 1 })}
        >
          <DoubleChevronLeftIcon size={iconSize} />
        </PaginationButton>
      )}

      <PaginationButton
        disabled={!hasPreviousPage}
        onClick={() => navigate({ page: currentPageNumber - 1 })}
      >
        <ChevronLeftIcon size={iconSize} />
      </PaginationButton>

      <PaginationButton
        disabled={!hasNextPage}
        onClick={() => navigate({ page: currentPageNumber + 1 })}
      >
        <ChevronRightIcon size={iconSize} />
      </PaginationButton>

      {pageNumbers.length > 2 && (
        <PaginationButton
          disabled={currentPageNumber === lastPageNumber}
          onClick={() => navigate({ page: lastPageNumber })}
        >
          <DoubleChevronRightIcon size={iconSize} />
        </PaginationButton>
      )}
    </HStack>
  );
};

const PaginationButton = (props) => (
  <IconButton variant="outline" isRound {...props} />
);
