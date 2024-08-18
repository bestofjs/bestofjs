import * as schema from "./schema";
import { LocalDatabase } from "./local-database";
import { VercelPostgresService } from "./vercel-database";
export * as schema from "./schema";

export type DB = ReturnType<typeof getDatabase>;

export function getDatabase() {
  const service = getService();
  return service.db;
}

export async function runQuery(callback: (db: DB) => Promise<void>) {
  const service = getService();

  try {
    await callback(service.db);
  } catch (error) {
    console.error(error);
  } finally {
    service.disconnect();
  }
}

function getService() {
  const service =
    process.env.STAGE === "local"
      ? new LocalDatabase()
      : new VercelPostgresService();
  return service;
}
