import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { withDefault } from "@optique/core/modifiers";
import { option } from "@optique/core/primitives";
import { defineCommand } from "@optique/discover/command";

import { withDatabase } from "@repo/core";
import {
  createProject,
  createProjectCliInputSchema,
} from "@repo/core/services/projects";

import { jsonPayload } from "../../../json-payload";

const placeholder = {
  repo: "owner/name",
  description: "What the project does",
};

export default defineCommand({
  path: ["projects", "create"],
  parser: object({
    project: option(
      "--json",
      jsonPayload(createProjectCliInputSchema, placeholder),
      {
        description: message`Inline JSON or a JSON file relative to the repository root. Samples: apps/cli/src/commands/projects/create/samples/`,
      },
    ),
    verbose: withDefault(option("-v", "--verbose"), false),
  }),
  metadata: {
    brief: message`Create a project and its GitHub repository.`,
    description: message`Insert the repo, project, packages, and tags in one transaction. Fails when the repo, slug, or name is already used.`,
  },
  async handler({ project, verbose }) {
    const result = await withDatabase((db) =>
      createProject({ db }, project, {
        onProgress: verbose
          ? (progress) => process.stderr.write(`${progress}\n`)
          : undefined,
      }),
    );
    process.stdout.write(
      `${JSON.stringify(
        {
          status: "created",
          command: "projects create",
          ...result,
        },
        null,
        2,
      )}\n`,
    );
  },
});
