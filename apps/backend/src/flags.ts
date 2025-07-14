import type { Command } from "cleye";
import { z } from "zod";

export const sharedFlagsSchema = z.object({
  concurrency: z.number().optional().default(1),
  dryRun: z.boolean().optional().default(false),
  logLevel: z.number().optional().default(3),
  limit: z.number().optional().default(0),
  skip: z.number().optional().default(0),
  fullName: z.string().optional().default(""),
  slug: z.string().optional().default(""),
  throttleInterval: z.number().optional().default(0),
});

export type ParsedFlags = z.infer<typeof sharedFlagsSchema>;

export const cliFlags: Command["options"]["flags"] = {
  concurrency: {
    type: Number,
    default: 1,
  },
  dryRun: {
    type: Boolean,
    description: "Dry run mode",
    default: false,
  },
  logLevel: {
    type: Number,
    description:
      "Log level: 0 => error, 1 => warn, 2 => log, 3 => info, 4 => debug...",
    default: 3,
  },
  limit: {
    type: Number,
    description: "Records to process",
    default: 0,
  },
  skip: {
    type: Number,
    description: "Records to skip (when paginating)",
    default: 0,
  },
  slug: {
    type: String,
    description: "Slug of the project to process",
  },
  fullName: {
    type: String,
    description: "Full name of the GitHub repo to process",
    default: "",
  },
  throttleInterval: {
    type: Number,
    description: "Throttle interval in milliseconds",
    default: 0,
  },
};
