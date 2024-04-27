import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env.mjs";

import * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

export type ProjectData = typeof schema.projects.$inferSelect;

export type EditableProjectData = Omit<
  ProjectData,
  "repoId" | "id" | "createdAt" | "updatedAt"
>;

export function getDatabase(): DB {
  const dbURL = env.POSTGRES_URL;
  const pg = postgres(dbURL);
  const db = drizzle(pg, { schema });
  return db;
}

export async function runQuery(callback: (db: DB) => Promise<void>) {
  const db = getDatabase();
  try {
    await callback(db);
    console.log("Done");
  } catch (error) {
    console.error(error);
  } finally {
    // TODO do we need to disconnect calling `pg.end()`?
    // console.log("Disconnected from database");
  }
}
