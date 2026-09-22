# Best of JS CLI

This app is the discoverable command interface for repository maintenance and
agent-operated workflows. Run all commands from the repository root:

```bash
pnpm cli
bun cli
pnpm cli tagging --help
pnpm cli tagging changes preview --json '{"schemaVersion":1,"operations":[]}'
```

The CLI loads `.env.development` by default. Set `STAGE` before the command to
select another repository environment file:

```bash
STAGE=production pnpm cli tagging changes preview --json plan.json
```

`STAGE` selects `.env.<stage>` before Bun starts, so database-backed commands
can consume `POSTGRES_URL` through the existing core package convention.

## Current status

Optique provides file-based discovery, scoped help, typed options, reusable
value parsing, structured parser errors, and in-process test capture. Bare
groups do not show help successfully by default, so the CLI has a generic
argument adapter that recognizes discovered command-path prefixes and appends
`--help`; unknown paths remain errors.

The tagging commands currently validate a representative plan schema. The
schema uses core's exported facet vocabulary to avoid duplicating domain
values. Database-backed preview and apply are the next implementation step.
Until then, preview reports only successful input validation, while apply
performs no writes and exits 2.
