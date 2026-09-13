import { db } from "@repo/core";
import { findFeaturedProjects } from "@repo/core/services/projects";

import { excludedTagCodes } from "@/config/apps";

export type { FeaturedProject } from "@repo/core/services/projects";

// TODO: Revisit this wrapper once listings are fully DB-driven
// (see docs/prd/replace-static-api-with-db.md): keep a consistent server
// boundary across listing queries or inline direct DB calls.
export async function findRandomFeaturedProjects({
  skip = 0,
  limit = 5,
}: {
  skip?: number;
  limit?: number;
} = {}) {
  // `excludedTagCodes` is applied to the whole featured ordering inside the
  // query, before pagination: the carousel pages by `skip`, so filtering after
  // the slice would make pages overlap and leave the last ones empty.
  return findFeaturedProjects(db, {
    skip,
    limit,
    excludedTagCodes:
      excludedTagCodes.length > 0 ? excludedTagCodes : undefined,
  });
}
