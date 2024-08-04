import { asc, desc, eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import { z } from "zod";

import { DB } from "../index";
import * as schema from "../schema";
import { PgColumn } from "drizzle-orm/pg-core";

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
    const repo = { ...project.repo, snapshots };
    return { ...project, repo };
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
    })
  ),
});

const snapshotSchema = z.object({
  year: z.number(),
  months: z.array(MonthSchema),
});

export type MonthSnapshots = z.infer<typeof MonthSchema>;

export const snapshotsSchema = z.array(snapshotSchema);

export type OneYearSnapshots = z.infer<typeof snapshotSchema>;
