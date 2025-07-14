import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import consola from "consola";
import prettyMs from "pretty-ms";

main();

/** Backup the database in `db-backup` folder at the root of the monorepo */
async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("Missing POSTGRES_URL environment variable");
  const nextBackupFilename = getNextBackupFilename();
  console.log(nextBackupFilename);

  const filepath = path.join(getFolderFullPath(), nextBackupFilename);
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

function getFolderFullPath() {
  const year = new Date().getFullYear();
  return path.join(process.cwd(), "db-backup", year.toString());
}

function getNextBackupFilename() {
  const nextBackupNumber = getNextBackupNumber();
  const formattedNumber = nextBackupNumber.toString().padStart(3, "0");
  return `backup-${formattedNumber}.sql`;
}

function getNextBackupNumber() {
  const fileNames = getPreviousBackupFilenames();
  const lastFileName = fileNames.at(-1);
  if (!lastFileName) return 1;
  const lastBackupNumber = extractBackupNumber(lastFileName);
  if (!lastBackupNumber) {
    throw new Error("Invalid backup filename");
  }
  return lastBackupNumber + 1;
}

function getPreviousBackupFilenames() {
  const filepath = getFolderFullPath();
  if (!existsSync(filepath))
    throw new Error(`Backup folder not found: ${filepath}`);
  const fileNames = readdirSync(filepath);
  fileNames.sort();
  return fileNames;
}

function extractBackupNumber(fileName: string): number | null {
  const match = fileName.match(/backup-(\d+)\.sql/);
  return match ? parseInt(match[1], 10) : null;
}
