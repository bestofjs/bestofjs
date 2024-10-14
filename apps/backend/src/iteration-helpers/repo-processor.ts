import { asc, desc, eq } from "drizzle-orm";

import { DB, schema } from "@repo/db";
import { snapshotsSchema } from "@repo/db/projects";
import { TaskLoopOptions, TaskRunnerContext } from "@/task-types";
import { ItemProcessor } from "./abstract-item-processor";

export type Repo = Awaited<ReturnType<typeof findRepoById>>;

export class RepoProcessor extends ItemProcessor<Repo> {
  type: "repo";

  constructor(context: TaskRunnerContext, loopOptions: TaskLoopOptions) {
    super(context, loopOptions);
    this.type = "repo";
  }

  toString(item: Repo) {
    return item.full_name;
  }

  async getAllItemsIds() {
    const { db, logger } = this.context;
    const { limit, skip, name } = this.loopOptions;

    const query = db
      .select({ id: schema.repos.id })
      .from(schema.repos)
      .orderBy(desc(schema.repos.added_at))
      .offset(skip);

    if (limit) {
      query.limit(limit);
    }

    if (name) {
      query.where(eq(schema.repos.name, name)); // TODO handle full_name instead of name
    }

    const repos = await query;
    if (!repos.length) logger.error("No repos found");

    const ids = repos.map((repo) => repo.id);
    return ids;
  }

  async getItemById(id: string) {
    return await findRepoById(this.context.db, id);
  }
}

async function findRepoById(db: DB, id: string) {
  const repo = await db.query.repos.findFirst({
    where: eq(schema.repos.id, id),
    with: {
      projects: {
        orderBy: asc(schema.projects.priority),
        with: {
          projectsToTags: {
            with: {
              tag: true,
            },
          },
        },
      },
      snapshots: {
        orderBy: asc(schema.snapshots.year),
      },
    },
  });

  if (!repo) throw new Error(`Repo not found by id: ${id}`);

  const projects = repo.projects.map((project) => {
    const tags = project.projectsToTags.map((ptt) => ptt.tag);
    return { ...project, tags };
  });

  const snapshots = snapshotsSchema.parse(repo.snapshots);
  const full_name = repo.owner + "/" + repo.name;

  return { ...repo, full_name, snapshots, projects };
}
