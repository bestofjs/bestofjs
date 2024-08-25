import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { DatabaseService } from "./database";
import { env } from "./env.mjs";
import * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

export class LocalDatabase implements DatabaseService<DB> {
  db: DB;
  pg: ReturnType<typeof postgres>;
  constructor() {
    const dbURL = env.POSTGRES_URL;
    this.pg = postgres(dbURL);
    this.db = drizzle(this.pg, { schema });
  }

  async disconnect() {
    await this.pg.end();
    console.log("Local DB disconnected");
  }
}
