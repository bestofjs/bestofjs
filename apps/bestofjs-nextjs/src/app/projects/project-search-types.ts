import { z } from "zod";

import { sortOptionsMap } from "@/components/project-list/sort-order-options";
import {
  limitSchema,
  PageSearchStateUpdater,
  PageSearchUrlBuilder,
  paginationSchema,
  SearchStateParser,
} from "@/lib/page-search-state";

const sortSchema = z.nativeEnum(sortOptionsMap);

export const projectSearchStateSchema = paginationSchema.extend({
  tags: z
    .preprocess(makeArray, z.array(z.string())) // accept string or array and convert to array
    .default([]),
  query: z.string().optional(),
  sort: sortSchema.default("total"),
  direction: z.enum(["desc", "asc"]).optional(),
});

export type ProjectSearchState = z.infer<typeof projectSearchStateSchema>;

export type ProjectSearchUpdater = PageSearchStateUpdater<ProjectSearchState>;

export type ProjectSearchUrlBuilder = PageSearchUrlBuilder<ProjectSearchState>;

export class ProjectSearchStateParser extends SearchStateParser<
  typeof projectSearchStateSchema
> {
  path = "/projects";

  constructor(options: Partial<ProjectSearchState> = {}) {
    const { sort = "total", limit = 30 } = options;

    const extendedSchema = projectSearchStateSchema.extend({
      sort: sortSchema.default(sort),
      limit: limitSchema.default(limit),
    });

    super(extendedSchema);
  }
}

function makeArray(input: unknown) {
  return typeof input === "string" ? [input] : input;
}
