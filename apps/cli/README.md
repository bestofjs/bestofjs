# Best of JS CLI

This app is the discoverable command interface for repository maintenance and
agent-operated workflows. Run all commands from the repository root:

```bash
pnpm cli
bun cli
pnpm cli tagging --help
pnpm cli tagging changes --json '{"schemaVersion":1,"operations":[]}'
```

The CLI loads `.env.development` by default. Set `STAGE` before the command to
select another repository environment file:

```bash
STAGE=production pnpm cli tagging changes --json plan.json
```

`STAGE` selects `.env.<stage>` before Bun starts, so database-backed commands
can consume `POSTGRES_URL` through the existing core package convention.

## Tagging plans

`tagging changes` applies a JSON plan (`schemaVersion: 1`) made of
operations:

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

Atomic plan execution, rollback-backed preview, and failure output that lists
the failed operation and completed prior operations are deferred until an
operational workflow justifies that hardening.

## Current status

Optique provides file-based discovery, scoped help, typed options, reusable
value parsing, structured parser errors, and in-process test capture. Bare
groups do not show help successfully by default, so the CLI has a generic
argument adapter that recognizes discovered command-path prefixes and appends
`--help`; unknown paths remain errors.

The tagging plan schema and execution live in the core package. Supported
operations are individually idempotent, and results are emitted as structured
JSON. The CLI is non-interactive and returns a non-zero exit code with a JSON
error when execution fails.
