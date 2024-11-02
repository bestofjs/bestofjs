import { DB, schema } from "@repo/db";
import { and, asc, desc, eq } from "@repo/db/drizzle";
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
    const { limit, skip, fullName, slug } = this.loopOptions;
    const { repos, projects } = schema;

    const query = db
      .select({ id: repos.id })
      .from(repos)
      .orderBy(desc(repos.added_at))
      .offset(skip);

    if (limit) {
      query.limit(limit);
    }

    if (fullName) {
      const [owner, name] = fullName.split("/");
      query.where(and(eq(repos.owner, owner), eq(repos.name, name)));
    }

    if (slug) {
      query.leftJoin(projects, eq(repos.id, projects.repoId));
      query.where(eq(projects.slug, slug));
    }

    const foundRepos = await query;
    if (!foundRepos.length) logger.error("No repos found");

    const ids = foundRepos.map((repo) => repo.id);
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
