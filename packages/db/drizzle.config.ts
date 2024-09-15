import type { Config } from "drizzle-kit";

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
  schema: "./src/schema.ts",
} satisfies Config;
