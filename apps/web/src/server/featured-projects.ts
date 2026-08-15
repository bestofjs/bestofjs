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
  if (excludedTagCodes.length === 0) {
    return findFeaturedProjects(db, { skip, limit });
  }

  // Featured projects come from a precomputed daily slug list, so the tags are
  // only known once the rows are fetched — the exclusion cannot be pushed into
  // the query. Over-fetch, then filter, then cut back to `limit`, so the
  // carousel still shows a full set instead of a short one.
  const { projects, total } = await findFeaturedProjects(db, {
    skip,
    limit: limit * 2,
  });
  const kept = projects.filter(
    (project) =>
      !project.tags.some((tag) => excludedTagCodes.includes(tag.code)),
  );
  return { projects: kept.slice(0, limit), total };
}
