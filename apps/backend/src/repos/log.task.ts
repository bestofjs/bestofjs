import { parseArgs } from "util";

import { processRepos } from "./process-repos";

// A basic Hello World task that loops through all repos

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    dryRun: {
      type: "boolean",
    },
    limit: {
      type: "string",
      optional: true,
    },
  },
  allowPositionals: true,
});

processRepos({ limit: Number(values.limit) }, async (repo) => {
  console.log(
    repo.name,
    repo.archived,
    repo.projects.map((project) => [project.name, project.status])
  );
});
