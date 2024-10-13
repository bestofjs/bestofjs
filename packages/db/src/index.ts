import { drizzle } from "drizzle-orm/vercel-postgres";

import { sql } from "./db";
import * as schema from "./schema";

export * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

export function getDatabase() {
  const service = new VercelPostgresService();
  return service.db;
}

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
    console.log("Vercel DB connected");
    this.db = drizzle(sql, { schema });
    sql.on("remove", () => {
      console.log("Vercel DB disconnected");
    });
  }

  disconnect() {
    sql.end();
  }
}
