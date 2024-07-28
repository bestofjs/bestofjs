# Seed scripts

This folder contains the scripts runs to initialize the content of the Posgres database from the previous MongoDB database.

Strategy:

- export `projects`, `tags` and `snapshots` collections from MongoDB, as JSON files (using "Export Data" command with the default options)
- Specify the path of the folder that contains the JSON data in the .env file. E.g. `MONGODB_DATA_FOLDER=../mongodb-backup/collections-2024`
- Import tags from `tags.json` file running `bun run packages/db/seed/import-tags.ts`
- Import projects from `projects.json` file running `bun run packages/db/seed/import-projects.ts`
- Import snapshots from `snapshots.json` file running, for every year `bun run packages/db/seed/import-projects.ts 2024`
