import { spinner as createSpinner } from "@clack/prompts";
import { DB, runQuery } from "~/index";

export async function runDbScript(
  callback: (db: DB, spinner: ReturnType<typeof createSpinner>) => Promise<void>
) {
  const spinner = createSpinner();
  await runQuery(async (db) => {
    spinner.start();
    return await callback(db, spinner);
  });
  spinner.stop("Disconnected from database");
  // const dbURL = process.env.POSTGRES_URL_DEV;
  // if (!dbURL) throw new Error("POSTGRES_URL environment variable is not set");
  // const pg = postgres(dbURL);
  // const db = drizzle(pg, { schema });
  // const spinner = createSpinner();
  // try {
  //   spinner.start();
  //   await callback(db, spinner);
  //   spinner.stop("Done");
  // } catch (error) {
  //   console.error(error);
  // } finally {
  //   await pg.end();
  // spinner.stop("Disconnected from database");
  // }
}
