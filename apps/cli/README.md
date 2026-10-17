# Best of JS CLI

This app is the command interface for repository maintenance and
agent-operated workflows. Run all commands from the repository root:

```bash
pnpm cli
bun cli
pnpm cli tagging --help
pnpm cli tagging changes --json '{"ops":[]}'
```

The CLI loads `.env.development` by default. Set `STAGE` before the command to
select another repository environment file:

```bash
STAGE=production pnpm cli tagging changes --json plan.json
```

`STAGE` picks `.env.<stage>` through Bun `--env-file`. Only that file is
loaded from the repository root. If the file is missing or it omits
`POSTGRES_URL`, database commands fail. They do not fall back to
`.env.development`. Variables already exported in the shell override file
values. Unset `POSTGRES_URL` in the shell when the stage file should supply
it.

## Tagging plans

`tagging changes` applies a JSON plan whose `ops` entries use `op` to identify
the change. `schemaVersion` defaults to `1` and can be included when an
explicit version is useful:

- `add-project-tags`: add tags (by code) to a project (by slug). Tags already
  assigned are skipped.
- `remove-project-tags`: remove direct tag assignments from a project. Tags
  that are not directly assigned are skipped; the tags themselves are not
  deleted.
- `update-tag`: change a tag (by code). `set` accepts `name`, `description`,
  `aliases`, `facet` (`ecosystem`, `category`, `capability`, `property`) and
  `parentCode`. `null` clears a field; an omitted field is left untouched.

Sample plans live in
[`src/commands/tagging/changes/samples/`](src/commands/tagging/changes/samples/):

| File | Covers |
| --- | --- |
| `add-project-tags.json` | Add tags to a project |
| `remove-project-tags.json` | Remove direct tags from a project |
| `update-tag-facet.json` | Set a tag facet |
| `update-tag-parent.json` | Set a tag parent |
| `mixed.json` | Several operations, including clearing a parent |

Project slugs and tag codes in the samples are illustrative. Review the JSON
plan, then apply it to disposable local development data before using it in a
less disposable environment:

```bash
pnpm cli tagging changes \
  --json apps/cli/src/commands/tagging/changes/samples/mixed.json
```

A missing project or tag stops the run with an error. Operations are applied
one by one without an outer transaction, so earlier operations stay applied
when a later one fails. Inspect the resulting data before rerunning a failed
plan. This initial command is intended for one maintainer working with reviewed
plans against local development data; it is not a production mutation policy.

Atomic plans, rollback preview, and partial-failure reports are not
implemented yet.

## Current status

Optique supplies help, typed options, JSON parsing, and parser errors. Bare
command groups do not print help unless you pass `--help`, so `run-cli.ts`
appends `--help` when the argv prefix matches a registered group. Unknown paths
still error.

Commands are imported in `src/run-cli.ts`. Each definition sets `path`.
Commands use the existing shared database through `@repo/core` and require
`POSTGRES_URL` at startup, including for help and flag parsing. `withDatabase`
passes the shared `db` to the handler and closes its pool when execution ends.
Plan schemas and execution are exposed through a regular barrel.

Execution errors become one JSON line on stderr and a non-zero exit code.
`formatError` walks `cause` chains with depth and cycle limits. Parser
mistakes still use Optique stderr output.

Plan schemas and `runTaggingPlan` live in `@repo/core`. Operations are
idempotent. The CLI prints JSON on stdout for success and stderr for failure.
