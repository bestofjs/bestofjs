import createDebug from "debug";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { sql } from "./db";
import * as schema from "./schema";

const debug = createDebug("db");

export * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

export const db = drizzle(sql, {
  schema,
  logger: process.env.ENABLE_SQL_LOGGING === "1",
});

export async function runQuery(callback: (db: DB) => Promise<void>) {
  const service = new VercelPostgresService();

  try {
    await callback(service.db);
  } catch (error) {
    console.error(error);
  } finally {
    service.disconnect();
  }
}

class VercelPostgresService {
  db: DB;

  constructor() {
    this.db = db;
    sql.on("connect", () => {
      debug("Vercel DB connected");
    });
    sql.on("remove", () => {
      debug("Vercel DB disconnected");
    });
  }

  disconnect() {
    sql.end();
  }
}
