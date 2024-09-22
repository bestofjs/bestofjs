import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    /** The huge JSON file with aggregated data about all projects tracked by Best of JS */
    STATIC_API_ROOT_URL_V1: z
      .string()
      .url()
      .default("https://bestofjs-static-api.vercel.app"),
    STATIC_API_ROOT_URL_V2: z
      .string()
      .url()
      .default("https://bestofjs-static-api-v2.vercel.app"),
    /** Monthly rankings data */
    RANKINGS_ROOT_URL: z
      .string()
      .url()
      .default("https://bestofjs-rankings.vercel.app"),
  },
  client: {
    /** Show time spent in search palette filter functions */
    NEXT_PUBLIC_DEBUG_SEARCH: z
      .string()
      .default("false")
      // only allow "true" or "false"
      .refine((s) => s === "true" || s === "false")
      // transform to boolean
      .transform((s) => s === "true"),
  },
  // For Next.js >= 13.4.4, you need to destructure client variables
  // See https://env.t3.gg/docs/nextjs
  experimental__runtimeEnv: {
    NEXT_PUBLIC_DEBUG_SEARCH: process.env.NEXT_PUBLIC_DEBUG_SEARCH,
  },
});
