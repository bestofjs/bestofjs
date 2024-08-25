import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { DatabaseService } from "./database";
import * as schema from "./schema";

export type DB = ReturnType<typeof drizzle<typeof schema>>;

export class VercelPostgresService implements DatabaseService<DB> {
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
