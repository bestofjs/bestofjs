/**
 * Generic types to handle search and pagination in Projects, Tags and Hall of Fame pages.
 */
import { encode } from "qss";
import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
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
 * given an `Updater` function that return the next state from the current search state.
 */
export type PageSearchUrlBuilder<T extends PaginationProps> = (
  updater: PageSearchStateUpdater<T>
) => string;

export class SearchStateParser<T extends z.ZodTypeAny> {
  constructor(public schema: T) {
    this.schema = schema;
  }

  parse(params: unknown) {
    return this.schema.parse(params) as z.infer<T>;
  }

  stringify(searchState: z.infer<T>) {
    return stateToQueryString(searchState);
  }
}

export function stateToQueryString<T extends PaginationProps>(searchState: T) {
  return encode(searchState);
}
