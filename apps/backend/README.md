# Best of JS backend tasks

Backend tasks to be run daily

- Update GitHub repository data
- Take a snapshot of the current number of stars
- Generate `project.json` file consumed by the web UI

Tasks run on GitHub action or a as build processon GitHub.
They can be run manually from the command line

```sh
bun run apps/backend/src/repos/log.task.ts --limit 100
```
