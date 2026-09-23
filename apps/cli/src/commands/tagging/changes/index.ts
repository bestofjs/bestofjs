import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { withDefault } from "@optique/core/modifiers";
import { flag, option } from "@optique/core/primitives";
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
    description: message`Apply idempotent tagging changes, or report them without writing with --dryRun.`,
  },
  async handler({ dryRun, plan }) {
    try {
      const result = await withDatabase((db) =>
        runTaggingPlan({ db, dryRun }, plan),
      );
      process.stdout.write(
        `${JSON.stringify(
          {
            status: dryRun ? "dry-run" : "applied",
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
          dryRun,
          error: error instanceof Error ? error.message : String(error),
        })}\n`,
      );
      process.exitCode = 1;
    }
  },
});
