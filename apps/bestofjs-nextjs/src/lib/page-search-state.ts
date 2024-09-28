/**
 * Generic types to handle search and pagination in Projects, Tags and Hall of Fame pages.
 */
import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

export type PaginationProps = z.infer<typeof paginationSchema>;

/**
 * A function that takes a current search state and returns a new search state.
 */
export type PageSearchStateUpdater<T extends PaginationProps> = (
  searchState: T
) => T;

/**
 * Paginated components get a `buildPageURL` function to generate the URL to navigate to,
 * given an `Updater` function that describes the changes to the current search state.
 */
export type PageSearchUrlBuilder<T extends PaginationProps> = (
  updater: PageSearchStateUpdater<T>
) => string;
