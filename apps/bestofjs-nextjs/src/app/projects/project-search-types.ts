import { z } from "zod";

import { sortOptionsMap } from "@/components/project-list/sort-order-options";
import {
  PageSearchStateUpdater,
  PageSearchUrlBuilder,
  paginationSchema,
  SearchStateParser,
} from "@/lib/page-search-state";

const sortSchema = z.nativeEnum(sortOptionsMap);

export const projectSearchStateSchema = paginationSchema.extend({
  tags: z.array(z.string()).default([]),
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
  constructor(options: Partial<ProjectSearchState> = {}) {
    const { sort = "total" } = options;
    const extendedSchema = projectSearchStateSchema.extend({
      sort: sortSchema.default(sort),
    });

    super(extendedSchema);
  }

  parse(params: Record<string, string | string[] | undefined>) {
    return this.schema.parse(params);
  }
}
