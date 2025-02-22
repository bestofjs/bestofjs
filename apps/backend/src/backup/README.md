# Database backup

Script to be run manually to generate a backup of the Postgres database in the folder `db-backup`, at the root of the monorepo.

Requirement: `pg_dump` (should come with `psql`)

```sh
NODE_ENV=production bun run ./apps/backend/src/backup/make-backup.ts
```
