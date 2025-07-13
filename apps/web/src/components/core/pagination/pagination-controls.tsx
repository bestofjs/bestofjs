import type React from "react";
import NextLink from "next/link";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/core/icons";
import { buttonVariants } from "@/components/ui/button";
import { formatNumber } from "@/helpers/numbers";
import type {
  PageSearchUrlBuilder,
  PaginationProps,
} from "@/lib/page-search-state";
import { cn } from "@/lib/utils";

import type { PaginationState } from "./pagination-state";

type Props<T extends PaginationProps> = {
  paginationState: PaginationState;
  buildPageURL: PageSearchUrlBuilder<T>;
  className?: string;
  compact?: boolean;
};
export const TopPaginationControls = <T extends PaginationProps>(
  props: Props<T>,
) => {
  const { className, compact, paginationState } = props;
  const { from, to, total } = paginationState;

  return (
    <div className="flex items-center">
      <div className={cn("text-sm", className)}>
        {!compact && <>Showing </>}
        {from !== to && (
          <>
            {from} - {to} of {formatNumber(total, "full")}
          </>
        )}
      </div>
    </div>
  );
};

export function BottomPaginationControls<T extends PaginationProps>(
  props: Props<T>,
) {
  const { paginationState, buildPageURL } = props;
  const { hasPreviousPage, hasNextPage } = paginationState;

  const previousPageURL = buildPageURL(
    (state: T) =>
      ({
        ...state,
        page: state.page - 1,
      }) as T,
  );
  const nextPageURL = buildPageURL((state: T) => ({
    ...state,
    page: state.page + 1,
  }));
  return (
    <div className="flex gap-2">
      <PaginationButton href={previousPageURL} isDisabled={!hasPreviousPage}>
        <ChevronLeftIcon className="size-4" />
        Prev
      </PaginationButton>
      <PaginationButton href={nextPageURL} isDisabled={!hasNextPage}>
        Next
        <ChevronRightIcon className="size-4" />
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
    <button
      disabled
      className={buttonVariants({ variant: "outline" })}
      type="button"
    >
      {children}
    </button>
  );
}
