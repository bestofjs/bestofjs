import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { option } from "@optique/core/primitives";
import { defineCommand } from "@optique/discover/command";

import { withDatabase } from "@repo/core";
import {
  EMPTY_TAGGING_PLAN,
  runTaggingPlan,
  taggingPlanSchema,
} from "@repo/core/services/tags/change-plan";

import { jsonPayload } from "../../../json-payload";

export default defineCommand({
  parser: object({
    plan: option("--json", jsonPayload(taggingPlanSchema, EMPTY_TAGGING_PLAN), {
      description: message`Inline JSON or a JSON file relative to the repository root. Samples: apps/cli/src/commands/tagging/changes/samples/`,
    }),
  }),
  metadata: {
    brief: message`Apply a declarative tagging plan.`,
    description: message`Apply idempotent tagging changes sequentially.`,
  },
  async handler({ plan }) {
    try {
      const result = await withDatabase((db) => runTaggingPlan({ db }, plan));
      process.stdout.write(
        `${JSON.stringify(
          {
            status: "applied",
            command: "tagging changes",
            ...result,
          },
          null,
          2,
        )}\n`,
      );
    } catch (error) {
      process.stderr.write(
        `${JSON.stringify({
          status: "error",
          command: "tagging changes",
          error: error instanceof Error ? error.message : String(error),
        })}\n`,
      );
      process.exitCode = 1;
    }
  },
});
