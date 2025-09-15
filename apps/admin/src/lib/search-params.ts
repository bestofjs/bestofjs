import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import { PROJECT_STATUSES } from "@repo/db/constants";
import { columnIdsSchema } from "@repo/db/projects";

// import { flagConfig } from "@/config/flag";
// import { type Task, tasks } from "@/db/schema";
import { getFiltersStateParser } from "@/lib/parsers";

const sortSchema = z.array(
  z.object({ id: columnIdsSchema, desc: z.boolean() }),
);

export const searchParamsCache = createSearchParamsCache({
  // filterFlag: parseAsStringEnum(
  //   flagConfig.featureFlags.map((flag) => flag.value),
  // ),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsJson(sortSchema).withDefault([{ id: "createdAt", desc: true }]),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.enum(PROJECT_STATUSES)).withDefault([]),
  tags: parseAsArrayOf(z.string()).withDefault([]),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
