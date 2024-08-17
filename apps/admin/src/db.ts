import { getDatabase } from "@repo/db";
import { ProjectService } from "@repo/db/projects";
import { SnapshotsService } from "@repo/db/snapshots";

const db = getDatabase();

/** Export singletons to avoid creating too many connections */
export const projectService = new ProjectService(db);

export const snapshotsService = new SnapshotsService(db);
