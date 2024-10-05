/**
 * Generic types to handle search and pagination in Projects, Tags and Hall of Fame pages.
 */
import { encode } from "qss";
import { z } from "zod";

export const limitSchema = z.coerce.number();

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: limitSchema.default(20),
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

export abstract class SearchStateParser<T extends z.ZodTypeAny> {
  abstract path: string;

  constructor(public schema: T) {
    this.schema = schema;
  }

  parse(params: unknown) {
    const searchState = this.schema.parse(params) as z.infer<T>;
    return {
      searchState,
      buildPageURL: this.createBuildPageURL(searchState),
    };
  }

  stringify(searchState: z.infer<T>) {
    return stateToQueryString(searchState);
  }

  createBuildPageURL(searchState: z.infer<T>) {
    return (updater: PageSearchStateUpdater<z.infer<T>>) => {
      const nextState = updater(searchState);
      const queryString = this.stringify(nextState);
      return this.path + "?" + queryString;
    };
  }
}

export function stateToQueryString<T extends PaginationProps>(searchState: T) {
  return encode(searchState);
}
