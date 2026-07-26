import { z } from "zod";

import { trendsSortKeySchema } from "@repo/db/shared-schemas";

import {
  limitSchema,
  type PageSearchStateUpdater,
  type PageSearchUrlBuilder,
  paginationSchema,
  SearchStateParser,
} from "@/lib/page-search-state";

export const trendsProjectSearchStateSchema = paginationSchema.extend({
  tags: z
    .preprocess(makeArray, z.array(z.string())) // accept string or array and convert to array
    .default([]),
  query: z.string().optional(),
  sort: trendsSortKeySchema.catch("most-stars").default("most-stars"),
  // Defaults to the filtered view: a bare /projects URL hides the projects the
  // UI would badge as a warning, and `?scope=all` opts into the full catalog.
  scope: z.enum(["all", "active"]).catch("active").default("active"),
});

export type TrendsProjectSearchState = z.infer<
  typeof trendsProjectSearchStateSchema
>;

export type TrendsProjectSearchUpdater =
  PageSearchStateUpdater<TrendsProjectSearchState>;

export type TrendsProjectSearchUrlBuilder =
  PageSearchUrlBuilder<TrendsProjectSearchState>;

export class TrendsProjectSearchStateParser extends SearchStateParser<
  typeof trendsProjectSearchStateSchema
> {
  path = "/projects";

  constructor(options: Partial<TrendsProjectSearchState> = {}) {
    const { limit = 30 } = options;

    const extendedSchema = trendsProjectSearchStateSchema.extend({
      limit: limitSchema.default(limit),
    });

    super(extendedSchema);
  }
}

function makeArray(input: unknown) {
  return typeof input === "string" ? [input] : input;
}
