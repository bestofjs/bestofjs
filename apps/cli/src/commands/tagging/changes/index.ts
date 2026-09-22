import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";

export default defineCommand({
  parser: object({}),
  metadata: {
    brief: message`Preview or apply a declarative tagging plan.`,
  },
  handler() {},
});
