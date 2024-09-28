import { z } from "zod";

import { sortOptionsMap } from "@/components/project-list/sort-order-options";
import {
  PageSearchStateUpdater,
  PageSearchUrlBuilder,
  paginationSchema,
} from "@/lib/page-search-state";

export const projectSearchStateSchema = paginationSchema.extend({
  tags: z.array(z.string()),
  query: z.string(),
  sort: z.nativeEnum(sortOptionsMap),
  direction: z.enum(["desc", "asc"]).optional(),
});

export type ProjectSearchState = z.infer<typeof projectSearchStateSchema>;

export type ProjectSearchUpdater = PageSearchStateUpdater<ProjectSearchState>;

export type ProjectSearchUrlBuilder = PageSearchUrlBuilder<ProjectSearchState>;
