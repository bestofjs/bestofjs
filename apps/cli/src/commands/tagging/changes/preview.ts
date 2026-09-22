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
    brief: message`Validate and preview a tagging plan without database access.`,
    description: message`Validates CLI input and echoes the prospective request. Database-backed preview is not implemented yet.`,
  },
  handler({ plan }) {
    process.stdout.write(
      `${JSON.stringify(
        {
          status: "validated",
          command: "tagging changes preview",
          databaseConnected: false,
          operationCount: plan.operations.length,
          plan,
        },
        null,
        2,
      )}\n`,
    );
  },
});
