import { z } from "zod";

import { trendsSortKeySchema } from "@repo/core/shared-schemas";

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
  // An absent query and an empty one both mean "not searching", and the UI
  // produces both: clearing the text-query chip sets `query: ""`, which `qss`
  // encodes as a bare `?query=`. Collapsing the two here leaves consumers
  // (`resolveScope()`, the page heading, the OG route) a single representation
  // to test — the alternative already caused one bug, where a check for `""`
  // sent every tag-filtered page down the "Search results" branch.
  query: z
    .string()
    .optional()
    .transform((value) => value || undefined),
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

  /**
   * `sort` and `scope` are overridable alongside `limit` because a listing page
   * that is not `/projects` needs different defaults — `/featured` opens on the
   * newest projects and over the whole catalog. Before this, the constructor
   * accepted the whole state but silently applied only `limit`, so passing
   * `{ sort: "newest" }` was a no-op.
   */
  constructor(options: Partial<TrendsProjectSearchState> = {}) {
    const { limit = 30, scope = "active", sort = "most-stars" } = options;

    const extendedSchema = trendsProjectSearchStateSchema.extend({
      limit: limitSchema.default(limit),
      scope: z.enum(["all", "active"]).catch(scope).default(scope),
      sort: trendsSortKeySchema.catch(sort).default(sort),
    });

    super(extendedSchema);
  }
}

function makeArray(input: unknown) {
  return typeof input === "string" ? [input] : input;
}
