import { db } from "@repo/core";
import { ProjectService } from "@repo/core/projects";
import { SnapshotsService } from "@repo/core/snapshots";

/** Export singletons to avoid creating too many connections */
export const projectService = new ProjectService(db);

export const snapshotsService = new SnapshotsService(db);
