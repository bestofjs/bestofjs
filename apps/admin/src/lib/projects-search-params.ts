import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

/** Raw search params in Next.js page.tsx props */
export interface PageSearchParams {
  [key: string]: string | string[] | undefined;
}

import { PROJECT_STATUSES } from "@repo/db/constants";
import { findProjectsSortSchema } from "@repo/db/shared-schemas";

import { getFiltersStateParser, parseAsNullableBoolean } from "@/lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),

  // No default sort specified to preserve the semantic difference between “no user preference” and “user explicitly chose an order”,
  sort: parseAsJson(findProjectsSortSchema).withDefault([]),

  // Used to search a specific project by name/description
  name: parseAsString.withDefault(""),

  // Normal filters
  archived: parseAsNullableBoolean,
  status: parseAsArrayOf(
    parseAsStringEnum(PROJECT_STATUSES.slice()),
  ).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),

  // Advanced filter: not implemented yet
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
