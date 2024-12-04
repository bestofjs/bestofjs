# Best of JS `db` package

This internal package is used to share the database connection among the applications.

It uses a Postgres database and Drizzle as the ORM.

To use it in an application within the monorepo, add this to `package.json`:

```json
"dependencies": {
  "@repo/db": "workspace:*"
}
```

Example of imports:

```ts
import { db, schema } from "@repo/db";
import { schema } from "@repo/db";
import { ProjectDetails } from "@repo/db/projects";
```

The entire Drizzle ORM library is included, allowing you to handle SQL queries from any application without needing to add Drizzle ORM as a dependency.

```ts
import { and, eq, SQL } from "@repo/db/drizzle";
```

## Database Client

To visualize the database structure and data, launch Drizzle Studio:

```sh
pnpm -F db studio
```

## Migrations

To generate migration files after updating the schema file (this will run `drizzle-kit generate`):

```sh
pnpm -F db generate
```
