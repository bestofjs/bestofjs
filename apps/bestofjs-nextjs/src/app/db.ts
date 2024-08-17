import { getDatabase } from "@repo/db";
import { ProjectService } from "@repo/db/projects";

const db = getDatabase();

/** Export a singleton to avoid creating too many connections */
export const projectService = new ProjectService(db);
