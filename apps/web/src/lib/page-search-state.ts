/**
 * Generic types to handle search and pagination in Projects, Tags and Hall of Fame pages.
 */
import { encode } from "qss";
import { z } from "zod";

export const limitSchema = z.coerce
  .number()
  .positive()
  .int()
  .max(100)
  .catch(10);

export const paginationSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: limitSchema.default(20),
});

export type PaginationProps = z.infer<typeof paginationSchema>;

/** Given a Zod schema that extends the pagination schema, the search state (including pagination) */
type SearchState<T extends z.ZodType> = z.infer<T> extends PaginationProps
  ? z.infer<T>
  : never;

/**
 * A function that takes a current search state and returns a new search state.
 */
export type PageSearchStateUpdater<T extends PaginationProps> = (
  searchState: T,
) => T;

/**
 * Paginated components get a `buildPageURL` function to generate the URL to navigate to,
 * given an `Updater` function that return the next state from the current search state
 * and an optional path when we need to override the default path (E.g. for tag links)
 */
export type PageSearchUrlBuilder<T extends PaginationProps> = (
  updater: PageSearchStateUpdater<T>,
  path?: string,
) => string;

export abstract class SearchStateParser<T extends z.ZodTypeAny> {
  abstract path: string;

  constructor(public schema: T) {
    this.schema = schema;
  }

  parse(params: unknown) {
    const searchState = this.schema.parse(params) as SearchState<T>;
    return {
      searchState,
      buildPageURL: this.createBuildPageURL(searchState),
    };
  }

  stringify(searchState: SearchState<T>) {
    return stateToQueryString(searchState);
  }

  createBuildPageURL(searchState: SearchState<T>) {
    return (updater: PageSearchStateUpdater<SearchState<T>>, path?: string) => {
      const nextState = updater(searchState);
      const queryString = this.stringify(nextState);
      return (path || this.path) + "?" + queryString;
    };
  }
}

export function stateToQueryString<T extends PaginationProps>(searchState: T) {
  return encode(searchState);
}
