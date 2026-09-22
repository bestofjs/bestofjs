import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";

export default defineCommand({
  parser: object({}),
  metadata: {
    brief: message`Inspect and maintain the Best of JS tagging taxonomy.`,
  },
  handler() {},
});
