import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { withDefault } from "@optique/core/modifiers";
import { flag, option } from "@optique/core/primitives";
import { defineCommand } from "@optique/discover/command";

import { jsonPayload } from "../../../json-payload";
import { EMPTY_TAGGING_PLAN, taggingPlanSchema } from "../../../tagging-plan";

export default defineCommand({
  parser: object({
    dryRun: withDefault(
      flag("--dryRun", {
        description: message`Validate and report changes without writing them.`,
      }),
      false,
    ),
    plan: option("--json", jsonPayload(taggingPlanSchema, EMPTY_TAGGING_PLAN), {
      description: message`Inline JSON or a JSON file relative to the repository root.`,
    }),
  }),
  metadata: {
    brief: message`Apply a declarative tagging plan.`,
    description: message`Database-backed tagging changes are not implemented yet. The command validates input, performs no writes, and exits nonzero.`,
  },
  handler({ dryRun, plan }) {
    process.stdout.write(
      `${JSON.stringify(
        {
          status: "not-implemented",
          command: "tagging changes",
          dryRun,
          databaseConnected: false,
          applied: false,
          operationCount: plan.operations.length,
          message: "Database-backed tagging changes are not implemented yet.",
        },
        null,
        2,
      )}\n`,
    );
    process.exitCode = 2;
  },
});
