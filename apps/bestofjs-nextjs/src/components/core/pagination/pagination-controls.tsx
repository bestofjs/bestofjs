import React from "react";
import NextLink from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import { buttonVariants } from "@/components/ui/button";
import { PaginationProps, SearchUrlBuilder } from "@/app/projects/types";

// import {
//   DoubleChevronLeftIcon,
//   DoubleChevronRightIcon,
//   ChevronRightIcon,
//   ChevronLeftIcon,
// } from "../icons";
import { PaginationState } from "./pagination-state";

// const iconSize = 28;

type Props<T> = {
  paginationState: PaginationState;
  buildPageURL: SearchUrlBuilder<T>;
};
export const TopPaginationControls = <T extends PaginationProps>(
  props: Props<T>
) => {
  const { paginationState } = props;
  const { from, to, total } = paginationState;

  return (
    <div className="flex items-center">
      <div className="text-sm">
        Showing{" "}
        {from === to ? (
          `#${from}`
        ) : (
          <>
            {from} - {to} of {total}
          </>
        )}
      </div>
    </div>
  );
};

export function BottomPaginationControls<T extends PaginationProps>(
  props: Props<T>
) {
  const { paginationState, buildPageURL } = props;
  const { hasPreviousPage, hasNextPage } = paginationState;

  const previousPageURL = buildPageURL(
    (state: T) =>
      ({
        ...state,
        page: state.page - 1,
      } as T)
  );
  const nextPageURL = buildPageURL((state: T) => ({
    ...state,
    page: state.page + 1,
  }));
  return (
    <div className="flex gap-2">
      <PaginationButton href={previousPageURL} isDisabled={!hasPreviousPage}>
        <ChevronLeftIcon className="h-4 w-4" />
        Prev
      </PaginationButton>
      <PaginationButton href={nextPageURL} isDisabled={!hasNextPage}>
        Next
        <ChevronRightIcon className="h-4 w-4" />
      </PaginationButton>
    </div>
  );
}

function PaginationButton({
  href,
  isDisabled,
  children,
}: {
  href: string;
  isDisabled: boolean;
  children: React.ReactNode;
}) {
  return !isDisabled ? (
    <NextLink href={href} className={buttonVariants({ variant: "outline" })}>
      {children}
    </NextLink>
  ) : (
    <button disabled className={buttonVariants({ variant: "outline" })}>
      {children}
    </button>
  );
}

// export const BottomPaginationControls = (props: PaginationState) => {
//   const {
//     currentPageNumber,
//     hasPreviousPage,
//     hasNextPage,
//     lastPageNumber,
//     pageNumbers,
//   } = props;
//   const { previousPageURL, nextPageURL, firstPageURL, lastPageURL } =
//     usePaginationURL(props);
//   return (
//     <div className="mt-8 w-full justify-end">
//       {pageNumbers.length > 2 && (
//         <PaginationLink
//           href={firstPageURL}
//           isDisabled={currentPageNumber === 1}
//           icon={<DoubleChevronLeftIcon size={iconSize} />}
//           aria-label="First page"
//         />
//       )}

//       <PaginationLink
//         href={previousPageURL}
//         isDisabled={!hasPreviousPage}
//         icon={<ChevronLeftIcon size={iconSize} />}
//         aria-label="Previous"
//       />

//       <PaginationLink
//         href={nextPageURL}
//         isDisabled={!hasNextPage}
//         icon={<ChevronRightIcon size={iconSize} />}
//         aria-label="Next"
//       />

//       {pageNumbers.length > 2 && (
//         <PaginationLink
//           href={lastPageURL}
//           isDisabled={currentPageNumber === lastPageNumber}
//           icon={<DoubleChevronRightIcon size={iconSize} />}
//           aria-label="Last"
//         />
//       )}
//     </div>
//   );
// };

// const PaginationLink = ({ href, ...props }: { href: string | UrlObject }) => {
//   return href ? (
//     <NextLink href={href} passHref>
//       <IconButton isRound {...props} />
//     </NextLink>
//   ) : (
//     <IconButton isRound {...props} />
//   );
// };
