import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { env } from "@/env.mjs";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

export async function runQuery(callback: (db: DB) => Promise<void>) {
  const db = getDatabase();
  try {
    await callback(db);
    console.log("Done");
  } catch (error) {
    console.error(error);
  } finally {
    await pg.end();
    console.log("Disconnected from database");
  }
}

export function getDatabase() {
  const dbURL = env.POSTGRES_URL;
  const pg = postgres(dbURL);
  const db = drizzle(pg, { schema });
  return db;
}
