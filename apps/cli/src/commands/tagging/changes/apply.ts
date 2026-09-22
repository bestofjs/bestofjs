import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { option } from "@optique/core/primitives";
import { defineCommand } from "@optique/discover/command";

import { jsonPayload } from "../../../json-payload";
import { EMPTY_TAGGING_PLAN, taggingPlanSchema } from "../../../tagging-plan";

export default defineCommand({
  parser: object({
    plan: option("--json", jsonPayload(taggingPlanSchema, EMPTY_TAGGING_PLAN), {
      description: message`Inline JSON or a JSON file relative to the repository root.`,
    }),
  }),
  metadata: {
    brief: message`Validate an apply request without writing anything.`,
    description: message`Database-backed apply is not implemented yet. This command validates input, performs no writes, and exits nonzero.`,
  },
  handler({ plan }) {
    process.stdout.write(
      `${JSON.stringify(
        {
          status: "not-implemented",
          command: "tagging changes apply",
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
