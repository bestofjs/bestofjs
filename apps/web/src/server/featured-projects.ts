import { db } from "@repo/db";
import { findFeaturedProjects } from "@repo/db/projects";

export type { FeaturedProject } from "@repo/db/projects";

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
  return findFeaturedProjects(db, { skip, limit });
}
