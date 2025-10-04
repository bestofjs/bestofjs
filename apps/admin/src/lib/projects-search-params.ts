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

// import { flagConfig } from "@/config/flag";
// import { type Task, tasks } from "@/db/schema";
import { getFiltersStateParser } from "@/lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  // filterFlag: parseAsStringEnum(
  //   flagConfig.featureFlags.map((flag) => flag.value),
  // ),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsJson(findProjectsSortSchema).withDefault([
    { id: "createdAt", desc: true },
  ]),
  name: parseAsString.withDefault(""),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(
    parseAsStringEnum(PROJECT_STATUSES.slice()),
  ).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
