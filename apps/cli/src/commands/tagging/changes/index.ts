import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { withDefault } from "@optique/core/modifiers";
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
  path: ["tagging", "changes"],
  parser: object({
    plan: option("--json", jsonPayload(taggingPlanSchema, EMPTY_TAGGING_PLAN), {
      description: message`Inline JSON or a JSON file relative to the repository root. Samples: apps/cli/src/commands/tagging/changes/samples/`,
    }),
    verbose: withDefault(option("-v", "--verbose"), false),
  }),
  metadata: {
    brief: message`Apply a JSON tagging plan.`,
    description: message`Run plan operations in order; repeats are no-ops.`,
  },
  async handler({ plan, verbose }) {
    const result = await withDatabase((db) =>
      runTaggingPlan({ db }, plan, {
        onProgress: verbose
          ? ({ index, total, op, target }) =>
              process.stderr.write(`[${index + 1}/${total}] ${op} ${target}\n`)
          : undefined,
      }),
    );
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
  },
});
