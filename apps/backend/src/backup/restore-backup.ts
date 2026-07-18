import { existsSync } from "node:fs";
import { cli } from "cleye";
import consola from "consola";
import prettyMs from "pretty-ms";

import {
  getBackupFolderFullPath,
  getPreviousBackupFilenames,
  resolveBackupPath,
} from "./backup-utils";

const TARGET_DB_DEFAULT = "bestofjs-dev";

main();

/** Restore a local Postgres database from a `db-backup` SQL dump. */
async function main() {
  cli(
    {
      name: "restore-backup",
      help: {
        description:
          "Drop and recreate the local database, then restore it from a `db-backup` SQL dump.",
        usage:
          "bun run ./apps/backend/src/backup/restore-backup.ts [selector] [flags]",
        examples: [
          "restore-backup              # restore the latest backup",
          "restore-backup 7            # restore backup-007.sql",
          "restore-backup backup-003.sql",
          "restore-backup --list       # list available backups",
          "restore-backup --dryRun     # print commands without executing",
        ],
      },
      parameters: ["[selector]"],
      flags: {
        list: {
          description: "List available backups and exit",
          type: Boolean,
        },
        yes: {
          description: "Skip the confirmation prompt",
          type: Boolean,
          alias: "y",
        },
        dryRun: {
          description: "Print the commands without executing them",
          type: Boolean,
        },
        dbName: {
          description: "Target database name (defaults to bestofjs-dev)",
          type: String,
          default: TARGET_DB_DEFAULT,
        },
      },
    },
    (argv) => {
      void run(argv.flags as RunFlags, argv._.selector);
    },
  );
}

type RunFlags = {
  list: boolean;
  yes: boolean;
  dryRun: boolean;
  dbName: string;
};

async function run(flags: RunFlags, selector?: string) {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("Missing POSTGRES_URL environment variable");

  if (flags.list) {
    listBackups();
    return;
  }

  assertLocalDb(url);

  const targetDb = flags.dbName;
  const filepath = resolveBackupPath(selector);
  if (!existsSync(filepath))
    throw new Error(`Backup file not found: ${filepath}`);

  consola.box("Restore...", filepath);
  consola.info(`Target database: ${targetDb}`);

  if (!flags.dryRun && !flags.yes) {
    const confirmed = await consola.prompt(
      `This will DROP and recreate the local "${targetDb}" database. Continue?`,
      { type: "confirm", initial: false },
    );
    if (!confirmed) {
      consola.info("Aborted.");
      return;
    }
  }

  const maintenanceUrl = swapDatabase(url, "postgres");
  const targetUrl = swapDatabase(url, targetDb);

  const start = Date.now();
  await nukeDatabase(maintenanceUrl, targetDb, flags.dryRun);
  await restoreDump(targetUrl, filepath, flags.dryRun);

  if (flags.dryRun) {
    consola.info("Dry run — no changes were made.");
    return;
  }
  consola.success("Restore done", prettyMs(Date.now() - start));
}

function listBackups() {
  const folder = getBackupFolderFullPath();
  const fileNames = getPreviousBackupFilenames();
  if (fileNames.length === 0) {
    consola.info(`No backups found in ${folder}`);
    return;
  }
  consola.info(`Available backups in ${folder}:`);
  for (const name of fileNames) console.log(`  ${name}`);
}

/** Drop and recreate the target database via a connection to the maintenance DB. */
async function nukeDatabase(
  maintenanceUrl: string,
  dbName: string,
  dryRun: boolean,
) {
  const createRole = [
    "DO $$",
    "BEGIN",
    "  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'default') THEN",
    '    CREATE ROLE "default" LOGIN;',
    "  END IF;",
    "END $$;",
  ].join(" ");

  const sql = [
    createRole,
    `DROP DATABASE IF EXISTS "${dbName}";`,
    `CREATE DATABASE "${dbName}";`,
  ];

  consola.info("Dropping and recreating database...");
  if (dryRun) {
    for (const statement of sql) console.log(`  psql -c ${statement}`);
    return;
  }

  const args = ["-v", "ON_ERROR_STOP=1"];
  for (const statement of sql) {
    args.push("-c", statement);
  }
  await runPsql([maintenanceUrl, ...args]);
}

async function restoreDump(
  targetUrl: string,
  filepath: string,
  dryRun: boolean,
) {
  consola.info("Restoring dump...");
  if (dryRun) {
    console.log(`  psql ${targetUrl} < ${filepath}`);
    return;
  }
  // ON_ERROR_STOP=1 so any real restore error (corrupt dump, failed CREATE, missing
  // extension) aborts psql with a non-zero exit code that runPsql surfaces, instead of
  // being swallowed and reported as a successful partial restore. The dump's OWNER
  // clauses target the `default` role, which nukeDatabase creates first, and psql
  // NOTICE/WARNING messages never abort regardless of this setting.
  await runPsql([targetUrl, "-v", "ON_ERROR_STOP=1"], { stdinFile: filepath });
}

async function runPsql(
  args: string[],
  opts?: { stdinFile?: string },
): Promise<void> {
  const stdin = opts?.stdinFile ? Bun.file(opts.stdinFile) : undefined;
  const proc = Bun.spawn(["psql", ...args], {
    stdin,
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`psql exited with code ${exitCode}`);
  }
}

/** Return a copy of `url` pointing at `dbName` (replaces the path segment). */
function swapDatabase(url: string, dbName: string): string {
  const parsed = new URL(url);
  parsed.pathname = `/${dbName}`;
  return parsed.toString();
}

/**
 * Hostnames that can never route to a remote/prod database. restore-backup is a
 * local-dev-only tool that DROPs its target, so we refuse to run against any
 * host outside this set — even on `--dryRun`, so a dry run against a stray prod
 * URL can't be mistaken for safety.
 */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "postgres"]);

function assertLocalDb(url: string): void {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    throw new Error(`POSTGRES_URL is not a valid URL: ${url}`);
  }
  // `new URL` keeps brackets around IPv6 hostnames.
  const normalized = hostname.replace(/^\[|\]$/g, "");
  if (!LOCAL_HOSTS.has(normalized)) {
    throw new Error(
      `Refusing to restore: POSTGRES_URL host "${normalized}" is not a known local host. ` +
        "restore-backup DROPs its target database and is local-dev-only. " +
        `Point POSTGRES_URL at a local database (one of: ${Array.from(LOCAL_HOSTS).join(", ")}).`,
    );
  }
}
