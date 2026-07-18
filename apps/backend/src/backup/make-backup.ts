import path from "node:path";
import consola from "consola";
import prettyMs from "pretty-ms";

import { getBackupFolderFullPath, getNextBackupFilename } from "./backup-utils";

main();

/** Backup the database in `db-backup` folder at the root of the monorepo */
async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("Missing POSTGRES_URL environment variable");
  const nextBackupFilename = getNextBackupFilename();
  console.log(nextBackupFilename);

  const filepath = path.join(getBackupFolderFullPath(), nextBackupFilename);
  await launchBackupCommand(url, filepath);
}

async function launchBackupCommand(dbURL: string, filepath: string) {
  consola.box("Backup...", filepath);
  const start = Date.now();
  try {
    const proc = Bun.spawn(["pg_dump", dbURL], {
      stdout: Bun.file(filepath),
    });
    proc.stdout;
    await proc.exited;
    consola.success("Backup done", prettyMs(Date.now() - start));
  } catch (error) {
    consola.error("Backup failed", error);
  }
}
