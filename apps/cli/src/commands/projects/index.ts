import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";

export default defineCommand({
  path: ["projects"],
  parser: object({}),
  metadata: {
    brief: message`Add projects tracked by Best of JS.`,
  },
  handler() {},
});
