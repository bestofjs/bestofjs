# Best of JS `db` package

The internal package used to shared the database connection between the applications.

It's a Postgres database and we use Drizzle as the ORM.

Add as a dependency like this:

```json
"dependencies": {
  "@repo/db": "workspace:*",
}
```

## Migrations

To generate migrations files, after the schema file is updated (will run `drizzle-kit generate`)

```sh
pnpm generate
```

Run migrations files

```sh
pnpm migrate
```
