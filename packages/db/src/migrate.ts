import { migrate } from "drizzle-orm/postgres-js/migrator";
import { DB, runQuery } from "./index";

runQuery(async (db: DB) => {
  console.log("Migrate PG");
  await migrate(db, { migrationsFolder: "./drizzle" });
});
