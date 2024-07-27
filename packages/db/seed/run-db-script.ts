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
}
