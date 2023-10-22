import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    /** The huge JSON file with aggregated data about all projects tracked by Best of JS */
    STATIC_API_ROOT_URL: z
      .string()
      .url()
      .default("https://bestofjs-static-api.vercel.app"),
    /** Serverless functions related to project details */
    PROJECT_DETAILS_API_ROOT_URL: z
      .string()
      .url()
      .default("https://bestofjs-serverless.vercel.app"),
    /** Monthly rankings data */
    RANKINGS_ROOT_URL: z
      .string()
      .url()
      .default("https://bestofjs-rankings.vercel.app"),
  },
});
