"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/core/icons";
import type { PaginationState } from "@/components/core/pagination/pagination-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/helpers/numbers";
import { cn } from "@/lib/utils";

export type DataTablePaginationProps = {
  paginationState: PaginationState;
  onPrevious: () => void;
  onNext: () => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  rowsPerPageLabel?: string;
};

const ELLIPSIS_TEXT = "...";
const PREVIOUS_PAGE_LABEL = "Go to previous page";
const NEXT_PAGE_LABEL = "Go to next page";

const btnBaseClasses = "size-7 p-0 text-sm";
const btnArrowClasses = btnBaseClasses + " rtl:transform rtl:rotate-180";

export function DataTablePagination({
  paginationState,
  onPrevious,
  onNext,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  className,
  rowsPerPageLabel = "Rows per page",
}: DataTablePaginationProps) {
  const {
    from,
    to,
    total,
    hasPreviousPage,
    hasNextPage,
    page,
    pageNumbers,
    numberOfPages,
  } = paginationState;

  const paginationInfo =
    total > 0 ? `${from} - ${to} of ${formatNumber(total, "full")}` : "";

  const showPrevEllipsis =
    pageNumbers.length > 0 && pageNumbers[0] > 1 && onPageChange;
  const showNextEllipsis =
    pageNumbers.length > 0 &&
    pageNumbers[pageNumbers.length - 1] < numberOfPages &&
    Boolean(onPageChange);

  return (
    <div
      data-slot="data-grid-pagination"
      className={cn(
        "flex grow flex-col flex-wrap items-center justify-between gap-2.5 py-2.5 sm:flex-row sm:py-0",
        className,
      )}
    >
      <div className="order-2 flex flex-wrap items-center space-x-2.5 pb-2.5 sm:order-1 sm:pb-0">
        {onPageSizeChange && (
          <>
            <div className="text-muted-foreground text-sm">
              {rowsPerPageLabel}
            </div>
            <Select
              value={`${paginationState.limit}`}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-20" aria-label={rowsPerPageLabel}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-18">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <div className="order-1 flex flex-col items-center justify-center gap-2.5 pt-2.5 sm:order-2 sm:flex-row sm:justify-end sm:pt-0">
        <div className="order-2 text-nowrap text-muted-foreground text-sm sm:order-1">
          {paginationInfo}
        </div>
        {numberOfPages > 1 && (
          <div className="order-1 flex items-center space-x-1 sm:order-2">
            <Button
              size="icon-sm"
              variant="ghost"
              className={btnArrowClasses}
              onClick={onPrevious}
              disabled={!hasPreviousPage}
            >
              <span className="sr-only">{PREVIOUS_PAGE_LABEL}</span>
              <ChevronLeftIcon className="size-4" />
            </Button>

            {showPrevEllipsis && (
              <Button
                size="icon-sm"
                className={btnBaseClasses}
                variant="ghost"
                onClick={() => onPageChange?.(pageNumbers[0] - 1)}
              >
                {ELLIPSIS_TEXT}
              </Button>
            )}

            {pageNumbers.map((pageNum) => {
              const isActive = pageNum === page;
              return (
                <Button
                  key={pageNum}
                  size="icon-sm"
                  variant="ghost"
                  className={cn(btnBaseClasses, "text-muted-foreground", {
                    "bg-accent text-accent-foreground": isActive,
                  })}
                  onClick={() => {
                    if (pageNum !== page) {
                      onPageChange?.(pageNum);
                    }
                  }}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNum}
                </Button>
              );
            })}

            {showNextEllipsis && (
              <Button
                size="icon-sm"
                className={btnBaseClasses}
                variant="ghost"
                onClick={() =>
                  onPageChange?.(pageNumbers[pageNumbers.length - 1] + 1)
                }
              >
                {ELLIPSIS_TEXT}
              </Button>
            )}

            <Button
              size="icon-sm"
              variant="ghost"
              className={btnArrowClasses}
              onClick={onNext}
              disabled={!hasNextPage}
            >
              <span className="sr-only">{NEXT_PAGE_LABEL}</span>
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
