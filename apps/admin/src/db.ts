import { db } from "@repo/core";
import { ProjectService } from "@repo/core/services/projects";
import { SnapshotsService } from "@repo/core/services/snapshots";

/** Export singletons to avoid creating too many connections */
export const projectService = new ProjectService(db);

export const snapshotsService = new SnapshotsService(db);
