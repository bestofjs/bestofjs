import { z } from "zod";

import {
  limitSchema,
  PageSearchStateUpdater,
  PageSearchUrlBuilder,
  paginationSchema,
  SearchStateParser,
} from "@/lib/page-search-state";

export const hallOfFameSearchStateSchema = paginationSchema.extend({
  query: z.string().optional(),
});

export type HallOfFameSearchState = z.infer<typeof hallOfFameSearchStateSchema>;

export type HallOfFameSearchUpdater =
  PageSearchStateUpdater<HallOfFameSearchState>;

export type HallOfFameSearchUrlBuilder =
  PageSearchUrlBuilder<HallOfFameSearchState>;

export class HallOfFameSearchStateParser extends SearchStateParser<
  typeof hallOfFameSearchStateSchema
> {
  path = "/hall-of-fame";

  constructor(options: Partial<HallOfFameSearchState> = {}) {
    const { limit = 50 } = options;

    const extendedSchema = hallOfFameSearchStateSchema.extend({
      limit: limitSchema.default(limit),
    });

    super(extendedSchema);
  }
}
