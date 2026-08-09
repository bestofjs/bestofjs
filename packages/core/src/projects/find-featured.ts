import { asc, desc, inArray } from "drizzle-orm";

import type { DB } from "../index";
import * as schema from "../schema";
import { computeTrends } from "../snapshots/compute-trends";
import type { Snapshot } from "../snapshots/types";
import { snapshotsSchema } from "./get";

export type FeaturedProject = {
  slug: string;
  name: string;
  logo: string | null;
  owner_id: number;
  trends: {
    daily?: number;
    weekly?: number;
    monthly?: number;
    quarterly?: number;
    yearly?: number;
  };
  tags: Array<{ code: string; name: string; description: string | null }>;
};
[];
export async function findFeaturedProjects(
  db: DB,
  { skip = 0, limit = 5 }: { skip?: number; limit?: number } = {},
): Promise<{ projects: FeaturedProject[]; total: number }> {
  const record = await db.query.dailyFeaturedProjects.findFirst({
    orderBy: desc(schema.dailyFeaturedProjects.createdAt),
  });
  const allSlugs = record?.projectSlugs ?? [];
  const slugs = allSlugs.slice(skip, skip + limit);

  if (!slugs.length) return { projects: [], total: allSlugs.length };

  const rawProjects = await db.query.projects.findMany({
    where: inArray(schema.projects.slug, slugs),
    with: {
      repo: {
        with: {
          snapshots: {
            orderBy: asc(schema.snapshots.year),
            columns: { year: true, months: true },
          },
        },
      },
      projectsToTags: { with: { tag: true } },
    },
  });

  // Preserve the random order from the slug list
  const bySlug = new Map(rawProjects.map((p) => [p.slug, p]));
  const projects = slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => {
      const yearRows = snapshotsSchema.parse(p.repo?.snapshots ?? []);
      const dailySnapshots = yearRows.flatMap(({ year, months }) =>
        months.flatMap(({ month, snapshots }) =>
          snapshots.map(
            ({ day, stars }): Snapshot => ({ year, month, day, stars }),
          ),
        ),
      );
      return {
        slug: p.slug,
        name: p.name,
        logo: p.logo,
        owner_id: p.repo.owner_id,
        trends: computeTrends(dailySnapshots),
        tags: p.projectsToTags.map((pt) => ({
          code: pt.tag.code,
          name: pt.tag.name,
          description: pt.tag.description,
        })),
      };
    });

  return { projects, total: allSlugs.length };
}
