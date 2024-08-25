import { desc, eq } from "drizzle-orm";

import { schema } from "@repo/db";
import { ProjectDetails, ProjectService } from "@repo/db/projects";

import { TaskLoopOptions, TaskRunnerContext } from "@/task-types";

import { ItemProcessor } from "./abstract-item-processor";

export class ProjectProcessor extends ItemProcessor<ProjectDetails> {
  type: "project";
  service: ProjectService;

  constructor(context: TaskRunnerContext, loopOptions: TaskLoopOptions) {
    super(context, loopOptions);
    this.type = "project";
    this.service = new ProjectService(context.db);
  }

  toString(item: ProjectDetails) {
    return item.slug;
  }

  async getAllItemsIds() {
    const { db, logger } = this.context;
    const { limit, skip, name } = this.loopOptions;
    const query = db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .orderBy(desc(schema.projects.createdAt))
      .limit(limit)
      .offset(skip);

    if (name) {
      query.where(eq(schema.projects.slug, name));
    }

    const projects = await query;
    if (!projects.length) logger.error("No projects found");

    const ids = projects.map((repo) => repo.id);
    return ids;
  }

  async getItemById(id: string) {
    return await this.service.getProjectById(id);
  }
}
