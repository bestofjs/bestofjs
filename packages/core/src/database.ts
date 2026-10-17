import { Pool } from "@neondatabase/serverless";
import createDebug from "debug";
import { drizzle } from "drizzle-orm/neon-serverless";

import "./db";

import * as schema from "./schema";

const debug = createDebug("db");
export type DB = ReturnType<typeof drizzle<typeof schema>>;

/** Create a connection only when database work is requested. */
export function createDatabase() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("POSTGRES_URL is not set");

  const pool = new Pool({ connectionString });
  pool.on("connect", () => debug("DB connected"));
  pool.on("remove", () => debug("DB disconnected"));
  const db = drizzle(pool, {
    schema,
    logger: process.env.ENABLE_SQL_LOGGING === "1",
  });
  return { db, pool };
}

/** Run one database command and always release its pool. */
export async function withDatabase<T>(callback: (db: DB) => Promise<T>) {
  const { db, pool } = createDatabase();
  try {
    return await callback(db);
  } finally {
    await pool.end();
  }
}
