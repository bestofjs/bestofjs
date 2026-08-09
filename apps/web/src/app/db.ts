import { db } from "@repo/core";
import { ProjectService } from "@repo/core/projects";

/** Export a singleton to avoid creating too many connections */
export const projectService = new ProjectService(db);
