import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const BACKUP_FOLDER = "db-backup";

export function getBackupFolderFullPath() {
  const year = new Date().getFullYear();
  return path.join(process.cwd(), BACKUP_FOLDER, year.toString());
}

export function getPreviousBackupFilenames(): string[] {
  const filepath = getBackupFolderFullPath();
  if (!existsSync(filepath))
    throw new Error(`Backup folder not found: ${filepath}`);
  const fileNames = readdirSync(filepath).filter(
    (name) => extractBackupNumber(name) !== null,
  );
  fileNames.sort();
  return fileNames;
}

export function extractBackupNumber(fileName: string): number | null {
  const match = fileName.match(/backup-(\d+)\.sql/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function getNextBackupNumber(): number {
  const fileNames = getPreviousBackupFilenames();
  const lastFileName = fileNames.at(-1);
  if (!lastFileName) return 1;
  const lastBackupNumber = extractBackupNumber(lastFileName);
  if (!lastBackupNumber) throw new Error("Invalid backup filename");
  return lastBackupNumber + 1;
}

export function getNextBackupFilename(): string {
  const nextBackupNumber = getNextBackupNumber();
  const formattedNumber = nextBackupNumber.toString().padStart(3, "0");
  return `backup-${formattedNumber}.sql`;
}

/** Resolve a user-supplied selector (filename, "latest", or a bare number) to a full path. */
export function resolveBackupPath(selector?: string): string {
  const folder = getBackupFolderFullPath();
  const fileNames = getPreviousBackupFilenames();

  if (!selector || selector === "latest") {
    const latest = fileNames.at(-1);
    if (!latest) throw new Error(`No backup found in ${folder}`);
    return path.join(folder, latest);
  }

  // Allow passing a bare number (e.g. "7" or "007") or a full filename.
  const asNumber = /^(\d+)$/.test(selector)
    ? Number.parseInt(selector, 10)
    : extractBackupNumber(selector);
  if (asNumber === null)
    throw new Error(`Invalid backup selector: ${selector}`);

  const formatted = `backup-${asNumber.toString().padStart(3, "0")}.sql`;
  if (!fileNames.includes(formatted))
    throw new Error(`Backup not found: ${formatted}`);

  return path.join(folder, formatted);
}
