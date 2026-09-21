import { and, asc, desc, inArray } from "drizzle-orm";

import type { DB } from "../../index";
import * as schema from "../../schema";
import { computeTrends } from "../snapshots/compute-trends";
import type { Snapshot } from "../snapshots/types";
import { findEffectiveTagsByProjectIds } from "../tags/effective";
import { selectProjectIdsHavingAnyTag } from "./find";
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
  {
    skip = 0,
    limit = 5,
    excludedTagCodes,
  }: { skip?: number; limit?: number; excludedTagCodes?: string[] } = {},
): Promise<{ projects: FeaturedProject[]; total: number }> {
  const record = await db.query.dailyFeaturedProjects.findFirst({
    orderBy: desc(schema.dailyFeaturedProjects.createdAt),
  });
  // Exclusion has to happen on the whole ordering, before `skip`/`limit`:
  // filtering a page's worth of rows instead would make consecutive pages
  // overlap and let `total` advertise pages with nothing left in them.
  const allSlugs = await excludeSlugsHavingAnyTag(
    db,
    record?.projectSlugs ?? [],
    excludedTagCodes,
  );
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
    },
  });
  const effectiveTags = await findEffectiveTagsByProjectIds(
    db,
    rawProjects.map((project) => project.id),
  );

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
        tags: (effectiveTags.get(p.id) ?? []).map((tag) => ({
          code: tag.code,
          name: tag.name,
          description: tag.description,
        })),
      };
    });

  return { projects, total: allSlugs.length };
}

/**
 * The featured ordering is a precomputed slug list, so the excluded tags cannot
 * be pushed into the listing query itself. One extra lookup — restricted to the
 * featured slugs — resolves which of them carry an excluded tag, by the same
 * definition `getWhereClauseExcludeTags()` uses.
 */
async function excludeSlugsHavingAnyTag(
  db: DB,
  slugs: string[],
  excludedTagCodes: string[] | undefined,
) {
  if (!excludedTagCodes?.length || !slugs.length) return slugs;

  const excludedRows = await db
    .select({ slug: schema.projects.slug })
    .from(schema.projects)
    .where(
      and(
        inArray(schema.projects.slug, slugs),
        inArray(
          schema.projects.id,
          selectProjectIdsHavingAnyTag(db, excludedTagCodes),
        ),
      ),
    );

  const excludedSlugs = new Set(excludedRows.map((row) => row.slug));
  return slugs.filter((slug) => !excludedSlugs.has(slug));
}
