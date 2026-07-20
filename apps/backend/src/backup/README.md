# Database backup

Scripts to be run manually to backup and restore the local Postgres database in the folder `db-backup`, at the root of the monorepo.

Requirement: `pg_dump` / `psql` (the PostgreSQL client tools).

## Backup

Generate a new `db-backup/<year>/backup-NNN.sql` dump from the database referenced by `POSTGRES_URL`:

```sh
pnpm backup
# or: NODE_ENV=production bun run ./apps/backend/src/backup/make-backup.ts
```

Dumps are taken with `pg_dump --no-owner --no-privileges`, so they omit
`OWNER`/`GRANT`/`REVOKE`/`ALTER DEFAULT PRIVILEGES` clauses. This makes them
portable: they restore cleanly into any Postgres (e.g. local Docker) without
the source host's platform roles (Neon's `neon_superuser`, `cloud_admin`, …)
needing to exist. The connecting user at restore time owns everything.

## Restore

Drop and recreate the local database, then load a `db-backup` dump into it.
Targets the local Docker database via `.env.development`, and refuses to run
against any non-local host (see `LOCAL_HOSTS` in the script), so it can never
hit a remote DB.

```sh
pnpm restore                  # restore the latest backup (prompts for confirmation)
pnpm restore 7                # restore backup-007.sql
pnpm restore backup-003.sql   # restore a specific file
pnpm restore --list           # list available backups
pnpm restore --dryRun         # print the commands without executing them
pnpm restore --yes            # skip the confirmation prompt
```

The restore recreates the `default` role used by the dump's `OWNER` clauses, drops and recreates the target database, then pipes the SQL file into `psql`.

> **Note on older dumps:** backups made before the `--no-owner --no-privileges`
> change still contain `ALTER DEFAULT PRIVILEGES … TO neon_superuser` clauses
> referencing Neon platform roles. Restoring those into a fresh local cluster
> fails with `role "neon_superuser" does not exist`. Either re-take the backup
> with `pnpm backup` (recommended), or create the roles once in the local
> cluster before restoring:
>
> ```sh
> psql "$POSTGRES_URL" \
>   -c 'CREATE ROLE "neon_superuser" LOGIN;' \
>   -c 'CREATE ROLE "cloud_admin" LOGIN;'
> ```
