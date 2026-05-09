import type { Config } from "drizzle-kit";

// drizzle-kit auto-detects the driver from installed packages in this order:
// pg → postgres → @vercel/postgres → @neondatabase/serverless.
// @neondatabase/serverless requires WebSocket and won't work with a local TCP
// Postgres instance, so `postgres` is listed as a devDependency to ensure
// drizzle-kit uses it instead for migrations in local development.

const url = process.env.POSTGRES_URL;
if (!url) {
  throw new Error("POSTGRES_URL not set");
}

export default {
  dbCredentials: {
    url,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/schema/index.ts",
} satisfies Config;
