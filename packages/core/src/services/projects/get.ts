import { asc, eq } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import invariant from "tiny-invariant";
import { z } from "zod";

import type { DB } from "../../index";
import * as schema from "../../schema";
import { starsExpression } from "./find-with-trends";

export type ProjectData = typeof schema.projects.$inferSelect;

export type ProjectCardData = NonNullable<
  Awaited<ReturnType<typeof getProjectCardData>>
>;

/**
 * The handful of fields a project's OG image renders: logo, name, description,
 * star total and weekly delta. Deliberately not `getProjectBySlug()`, which
 * loads every yearly snapshot row, the tags and the packages to draw one card.
 *
 * `repo_trends` is LEFT-joined so a deprecated project (no trends row) still
 * gets an image, with `starsExpression` falling back to `repos.stars`.
 */
export async function getProjectCardData({
  db,
  slug,
}: {
  db: DB;
  slug: string;
}) {
  const [row] = await db
    .select({
      name: schema.projects.name,
      description: schema.projects.description,
      logo: schema.projects.logo,
      owner_id: schema.repos.owner_id,
      stars: starsExpression,
      weeklyStars: schema.repoTrends.weekly,
    })
    .from(schema.projects)
    .innerJoin(schema.repos, eq(schema.projects.repoId, schema.repos.id))
    .leftJoin(schema.repoTrends, eq(schema.repoTrends.repoId, schema.repos.id))
    .where(eq(schema.projects.slug, slug))
    .limit(1);

  return row ?? null;
}

export class ProjectService {
  db: DB;
  constructor(db: DB) {
    this.db = db;
  }

  async getProjectBySlug(slug: string) {
    return await this.getProjectByKey(schema.projects.slug, slug);
  }

  async getProjectById(id: string) {
    const project = await this.getProjectByKey(schema.projects.id, id);
    if (!project) throw new Error(`Project not found by id: ${id}`);
    return project;
  }

  async getProjectByKey(key: PgColumn, value: string) {
    const project = await this.db.query.projects.findFirst({
      where: eq(key, value),
      with: {
        repo: {
          with: {
            snapshots: {
              orderBy: asc(schema.snapshots.year),
              columns: {
                year: true,
                months: true,
              },
            },
          },
        },
        projectsToTags: {
          with: {
            tag: {},
          },
        },
        packages: {
          with: { bundles: true },
        },
      },
    });
    if (!project) return null;
    invariant(project?.repo);
    const snapshots = snapshotsSchema.parse(project?.repo?.snapshots);
    const repo = {
      ...project.repo,
      full_name: project.repo.owner + "/" + project.repo.name,
      snapshots,
    };

    const tags = project.projectsToTags.map((ptt) => ptt.tag);

    return { ...project, repo, tags };
  }
}

export type ProjectDetails = NonNullable<
  Awaited<ReturnType<ProjectService["getProjectBySlug"]>>
>;

const MonthSchema = z.object({
  month: z.number(),
  snapshots: z.array(
    z.object({
      day: z.number(),
      stars: z.number(),
    }),
  ),
});

const snapshotSchema = z.object({
  year: z.number(),
  months: z.array(MonthSchema),
});

export type MonthSnapshots = z.infer<typeof MonthSchema>;

export const snapshotsSchema = z.array(snapshotSchema);

export type OneYearSnapshots = z.infer<typeof snapshotSchema>;
