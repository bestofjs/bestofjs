# Best of JS `core` package

This internal package holds the domain logic shared by every application: the database connection, the Drizzle schema, and the services built on top of them.

It uses a Postgres database and Drizzle as the ORM.

To use it in an application within the monorepo, add this to `package.json`:

```json
"dependencies": {
  "@repo/core": "workspace:*"
}
```

Example of imports:

```ts
import { db, schema } from "@repo/core";
import { ProjectDetails } from "@repo/core/services/projects";
import { findTags } from "@repo/core/services/tags";
```

The entire Drizzle ORM library is included, allowing you to handle SQL queries from any application without needing to add Drizzle ORM as a dependency.

```ts
import { and, eq, SQL } from "@repo/core/drizzle";
```

## Layout

Every domain lives in its own folder under `src/services/`, holding both its queries and the Drizzle definitions of the tables it owns:

```
src/
  index.ts            db client, DB type, runQuery, `export * as schema`
  db.ts               neonConfig side effects
  drizzle.ts          re-export of drizzle-orm
  constants.ts
  shared-schemas.ts
  schema.ts           re-exports every *.sql.ts
  services/
    projects/         create find get update ... + projects.sql.ts
    tags/             create find get update ... + tags.sql.ts
    snapshots/        ... + snapshots.sql.ts
    hall-of-fame/     find.ts + hall-of-fame.sql.ts
    project-trends/   scoring labels + project-trends{,-view}.sql.ts
    repo-trends/      scoring + repo-trends{,-view}.sql.ts
    repos/            repos.sql.ts        (tables only, no service yet)
    packages/         packages.sql.ts bundles.sql.ts
```

Services with logic expose an `index.ts` barrel wired to a subpath export in `package.json`. Table definitions are picked up by the `./src/**/*.sql.ts` glob in `drizzle.config.ts`, so a new table goes next to the service that owns it — no central folder to register it in.

Two rules keep the module graph acyclic. Services import `db` from the package root (`../..`), so a cycle back into a service would leave `db` undefined at module init:

1. `schema.ts` imports the `.sql.ts` files **directly**, never through a service barrel.
2. Service barrels do **not** re-export their `.sql.ts` files — consumers reach tables via `schema.projects` from the root export.

## Database Client

To visualize the database structure and data, launch Drizzle Studio:

```sh
pnpm -F core studio
```

## Migrations

To generate migration files after updating the schema file (this will run `drizzle-kit generate`):

```sh
pnpm -F core generate
```

## Tests

Unit tests cover the pure functions (scoring formulas, snapshot logic) and never touch the database:

```sh
pnpm -F core test
```

Database queries are checked manually against real data (local or production) with the `check-trends-queries` task in `apps/backend` — see the backend README.
