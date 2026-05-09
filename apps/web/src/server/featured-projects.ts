import { db, schema } from "@repo/db";
import { desc } from "@repo/db/drizzle";

type GetProjectBySlug = (
  slug: string,
) => Promise<{ project: BestOfJS.Project | undefined }>;

export async function findRandomFeaturedProjects(
  getProjectBySlug: GetProjectBySlug,
  { skip = 0, limit = 5 }: { skip?: number; limit?: number } = {},
) {
  const record = await db.query.dailyFeaturedProjects.findFirst({
    orderBy: desc(schema.dailyFeaturedProjects.createdAt),
  });
  const allSlugs = record?.projectSlugs ?? [];
  const slugs = allSlugs.slice(skip, skip + limit);
  const results = await Promise.all(slugs.map(getProjectBySlug));
  const projects = results
    .map((r) => r.project)
    .filter((p): p is BestOfJS.Project => p !== undefined);
  return { projects, total: allSlugs.length };
}
