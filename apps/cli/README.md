# Best of JS CLI

This app is the discoverable command interface for repository maintenance and
agent-operated workflows. Run all commands from the repository root:

```bash
pnpm cli
bun cli
pnpm cli tagging --help
pnpm cli tagging changes --json '{"schemaVersion":1,"operations":[]}'
pnpm cli tagging changes --dryRun --json ./tagging-changes.json
```

The CLI loads `.env.development` by default. Set `STAGE` before the command to
select another repository environment file:

```bash
STAGE=production pnpm cli tagging changes --json plan.json
```

`STAGE` selects `.env.<stage>` before Bun starts, so database-backed commands
can consume `POSTGRES_URL` through the existing core package convention.

## Current status

Optique provides file-based discovery, scoped help, typed options, reusable
value parsing, structured parser errors, and in-process test capture. Bare
groups do not show help successfully by default, so the CLI has a generic
argument adapter that recognizes discovered command-path prefixes and appends
`--help`; unknown paths remain errors.

The tagging plan schema and execution live in the core package. Like the
backend task runner, normal execution applies idempotent changes while
`--dryRun` queries the selected database and reports the changes without
writing them. Results are emitted as structured JSON.
