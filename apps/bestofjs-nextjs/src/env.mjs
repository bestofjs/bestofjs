import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    STATIC_API_ROOT_URL: z
      .string()
      .url()
      .default("https://bestofjs-static-api.vercel.app"),
    PROJECT_DETAILS_API_ROOT_URL: z
      .string()
      .url()
      .default("https://bestofjs-serverless.vercel.app"),
    RANKINGS_ROOT_URL: z
      .string()
      .url()
      .default("https://bestofjs-rankings.vercel.app"),
  },
});
