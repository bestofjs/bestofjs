import { z } from "zod";

import { ProjectService } from "@repo/db/projects";
import { SnapshotsService } from "@repo/db/snapshots";
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

    const snapshots = await getFirstSnapshotsOfTheMonth(events, year);

    logger.debug(`${year} snapshots`, snapshots);

    if (!dryRun) {
      await snapshotService.addMissingSnapshotsForYear(
        project.repo.id,
        year,
        snapshots
      );
    }

    return { data: snapshots.length, meta: { processed: true } };
  },
});
