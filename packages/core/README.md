# Best of JS `db` package

This internal package is used to share the database connection among the applications.

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
import { schema } from "@repo/core";
import { ProjectDetails } from "@repo/core/projects";
```

The entire Drizzle ORM library is included, allowing you to handle SQL queries from any application without needing to add Drizzle ORM as a dependency.

```ts
import { and, eq, SQL } from "@repo/core/drizzle";
```

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
