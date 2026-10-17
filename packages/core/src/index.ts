import { createDatabase, type DB } from "./database";

export type { DB } from "./database";
export { withDatabase } from "./database";
export * as schema from "./schema";

const { db, pool } = createDatabase();
export { db };

export async function runQuery(callback: (db: DB) => Promise<void>) {
  try {
    await callback(db);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}
