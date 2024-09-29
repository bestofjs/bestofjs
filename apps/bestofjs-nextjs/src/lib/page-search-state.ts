/**
 * Generic types to handle search and pagination in Projects, Tags and Hall of Fame pages.
 */
import { encode } from "qss";
import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(5),
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

// export function parseSearchParams<T extends z.ZodTypeAny>(
//   params: Record<string, string>,
//   schema: T
// ) {
//   return schema.parse(params) as z.infer<T>;
// }

export class SearchStateParser<T extends z.ZodTypeAny> {
  constructor(public schema: T) {
    this.schema = schema;
  }

  parse(params: unknown) {
    return this.schema.parse(params);
  }

  stringify(searchState: z.infer<T>) {
    return stateToQueryString(searchState);
  }
}

export function stateToQueryString<T extends PaginationProps>(searchState: T) {
  return encode(searchState);
}
