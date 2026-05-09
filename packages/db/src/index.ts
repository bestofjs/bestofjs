import { Pool } from "@neondatabase/serverless";
import createDebug from "debug";
import { drizzle } from "drizzle-orm/neon-serverless";

import "./db"; // applies neonConfig side effects before the pool is created

import * as schema from "./schema";

const debug = createDebug("db");

export * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL is not set");

const pool = new Pool({ connectionString });

export const db = drizzle(pool, {
  schema,
  logger: process.env.ENABLE_SQL_LOGGING === "1",
});

export async function runQuery(callback: (db: DB) => Promise<void>) {
  const service = new NeonDbService();

  try {
    await callback(service.db);
  } catch (error) {
    console.error(error);
  } finally {
    await service.disconnect();
  }
}

class NeonDbService {
  db: DB;

  constructor() {
    this.db = db;
    pool.on("connect", () => {
      debug("DB connected");
    });
    pool.on("remove", () => {
      debug("DB disconnected");
    });
  }

  disconnect() {
    return pool.end();
  }
}
