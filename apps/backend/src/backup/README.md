# Database backup

Scripts to be run manually to backup and restore the local Postgres database in the folder `db-backup`, at the root of the monorepo.

Requirement: `pg_dump` / `psql` (the PostgreSQL client tools).

## Backup

Generate a new `db-backup/<year>/backup-NNN.sql` dump from the database referenced by `POSTGRES_URL`:

```sh
pnpm backup
# or: NODE_ENV=production bun run ./apps/backend/src/backup/make-backup.ts
```

## Restore

Drop and recreate the local database, then load a `db-backup` dump into it.
Targets the local Docker database via `.env.development` so it can never hit a remote DB.

```sh
pnpm restore                  # restore the latest backup (prompts for confirmation)
pnpm restore 7                # restore backup-007.sql
pnpm restore backup-003.sql   # restore a specific file
pnpm restore --list           # list available backups
pnpm restore --dryRun         # print the commands without executing them
pnpm restore --yes            # skip the confirmation prompt
```

The restore recreates the `default` role used by the dump's `OWNER` clauses, drops and recreates the target database, then pipes the SQL file into `psql`.
