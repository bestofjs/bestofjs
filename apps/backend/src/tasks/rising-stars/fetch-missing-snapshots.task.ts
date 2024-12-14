import { z } from "zod";

import { ProjectService } from "@repo/db/projects";
import { SnapshotsService, toDate } from "@repo/db/snapshots";
import { createTask } from "@/task-runner";
import {
  fetchAllStargazers,
  getFirstSnapshotsOfTheMonth,
} from "./fetch-stargazers";

export const fetchMissingSnapshotsTask = createTask({
  name: "fetch-missing-snapshots",
  description: "Fetch missing snapshots",
  flags: {
    slug: { type: String, required: true },
    year: { type: Number, default: 2024 },
  },
  schema: z.object({ slug: z.string(), year: z.number() }),
  run: async (context, flags) => {
    const { db, logger, dryRun } = context;
    const { slug, year } = flags;
    const service = new ProjectService(db);
    const snapshotService = new SnapshotsService(db);
    const project = await service.getProjectBySlug(slug);
    if (!project) throw new Error(`Project not found: ${slug}`);

    const { owner, name } = project.repo;
    logger.debug(
      `Fetching missing snapshots for ${owner}/${name} until ${project.createdAt}`
    );

    const events = await fetchAllStargazers(owner, name, project.createdAt);

    logger.debug("Stargazer events found", events.length);

    const oneYearSnapshots = await getFirstSnapshotsOfTheMonth(events, year);
    const snapshots = oneYearSnapshots.filter(
      (snapshot) => toDate(snapshot) > project.repo.created_at
    );

    logger.debug(`${year} snapshots`, snapshots);

    if (dryRun) logger.warn("Dry run, no DB write!");

    const saved = dryRun
      ? false
      : await snapshotService.addMissingSnapshotsForYear(
          project.repo.id,
          year,
          snapshots
        );

    return { data: snapshots.length, meta: { saved } };
  },
});
