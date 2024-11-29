# Best of JS backend tasks

Backend tasks to be run daily, such as:

- Update repository data from GitHub API
- Take a snapshot of the current number of stars
- Generate `projects.json` file consumed by the web UI (the "static API")

Tasks can run on:

- GitHub Actions as CRON jobs
- Vercel as part of the build process
- Locally from the command line.

We use the library [Cleye](https://github.com/privatenumber/cleye) to build the CLI app, the file `src/cli.ts` being the entry point.

## Tasks definition

Tasks are defined in the `src/tasks` folder. Each `<task-name>.task.ts` file in this folder contains the definition of a task. These tasks are then executed as part of the backend processes.

Run the help command to see the available tasks:

```sh
bun run apps/backend/src/cli.ts --help
```

## Running tasks

Tasks can be run using `bun src/cli.ts` followed by the name of the task.

The "Hello world" tasks can be used to check the behavior of the task runner

```sh
bun run apps/backend/src/cli.ts hello-world-projects --limit 100
```

Some flag are available at the global level (for all tasks):

- limit
- skip
- logLevel
- dryMode
- concurrency
- throttleInterval
- ...

Additional flags can be available at the task level, the task definition will get extra `flags` and `schema` parameters to handle them.

Check the `--help` command related to each task for more details.
