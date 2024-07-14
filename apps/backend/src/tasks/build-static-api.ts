import { Task } from "@/task-runner";
import { getProjectTrends, getProjectURL } from "@repo/db/projects";

type ProjectItem = {
  name: string;
  description: string;
  stars: number;
  trends: {
    daily?: number;
    weekly?: number | null;
    monthly?: number | null;
    yearly?: number | null;
  };
};

export const buildStaticApiTask: Task = {
  name: "build-static-api",
  run: async ({ processProjects, saveJSON }) => {
    const results = await processProjects<ProjectItem>(async (project) => {
      const repo = project.repo;

      if (!repo) throw new Error("No repo found");
      if (!repo.snapshots?.length)
        return { data: null, meta: { "no snapshot": true, included: false } };

      const trends = getProjectTrends(repo.snapshots);
      const tags = project.projectsToTags.map((ptt) => ptt.tag.code);

      const url = getProjectURL(project);
      const icon = project.logo;

      const data = {
        full_name: project.repo.full_name,
        owner: repo.owner_id,
        name: project.name,
        description: repo.description || "",
        stars: repo.stars || 0,
        tags,
        trends,
        contributor_count: repo.contributor_count,
        pushed_at: formatDate(repo.last_commit),
        created_at: formatDate(repo.created_at),
        ...(url && { url }),
        ...(icon && { icon }),
      };

      return {
        meta: { included: true },
        data,
      };
    });

    // const data = results.map((result) => result.data);
    await saveJSON(results.data, "static-api.json");
    return results;
  },
};

function formatDate(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : null;
}
