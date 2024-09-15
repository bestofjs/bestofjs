import { migrate } from "drizzle-orm/postgres-js/migrator";

import { DB, runQuery } from "./index";

runQuery(async (db: DB) => {
  console.log("Migrate PG");
  // @ts-expect-error TODO `migrate` should be provided by the database service
  await migrate(db, { migrationsFolder: "./drizzle" });
});
