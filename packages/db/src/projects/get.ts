import { desc, eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import { z } from "zod";

import { getDatabase } from "../index";
import * as schema from "../schema";

export async function getProjectBySlug(slug: string) {
  const db = getDatabase();
  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.slug, slug),
    with: {
      repo: {
        with: {
          snapshots: {
            orderBy: desc(schema.snapshots.year),
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
        columns: {
          name: true,
          version: true,
          deprecated: true,
          dependencies: true,
        },
      },
    },
  });
  if (!project) return null;
  invariant(project?.repo);
  const snapshots = snapshotsSchema.parse(project?.repo?.snapshots);
  const repo = { ...project.repo, snapshots };
  return { ...project, repo };
}

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

const snapshotsSchema = z.array(snapshotSchema);

export type OneYearSnapshots = z.infer<typeof snapshotSchema>;
