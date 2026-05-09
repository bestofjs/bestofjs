# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Best of JS is a curated collection of ~3,000 JavaScript/web projects that tracks ecosystem trends and GitHub stars. This is a **pnpm monorepo** orchestrated with **Turbo**.

## Monorepo Structure

```
apps/
  web/       Next.js public-facing app (React 19, TypeScript, Tailwind 4)
  admin/     Next.js admin app for managing projects/tags (local only, not deployed)
  backend/   Node.js CLI tasks for data collection and static API generation
  legacy/    Deprecated Vite/React app
packages/
  api/       Shared GitHub/NPM API utilities
  db/        PostgreSQL schema (Drizzle ORM), queries, and migrations
docs/        Architecture documentation
```

## Commands

**Package manager:** pnpm 11.0.8+ required. **Node:** 24.x+.

### Root (Turbo-orchestrated)
```bash
pnpm build           # Build all apps/packages
pnpm lint            # Lint with Biome
pnpm typecheck       # TypeScript type checking
pnpm test            # Run web app unit tests
pnpm test:e2e        # Playwright E2E tests
```

### Per-app (use `-F <name>` filter)
```bash
pnpm -F web dev                   # Next.js dev server (Turbopack)
pnpm -F web test                  # Vitest unit tests
pnpm -F web test --watch          # Watch mode
pnpm -F web test:e2e              # Playwright E2E tests
pnpm -F admin dev                 # Admin dev server
pnpm -F backend daily-update-github-data    # Fetch GitHub stars/metadata
pnpm -F backend daily-update-package-data   # Fetch NPM info
pnpm -F backend static-api-daily            # Full daily data pipeline
pnpm -F db generate               # Generate Drizzle migrations
pnpm -F db push                   # Apply schema to DB
pnpm -F db studio                 # Drizzle Studio GUI
```

### Backend task flags
```bash
--limit N          # Process only N items
--dryRun           # Execute without making changes
--logLevel 4       # Debug logging
--concurrency N    # Parallel processing
--throttleInterval MS  # Wait between API calls
```

## Architecture

### Data Flow
1. **GitHub Actions** (daily 21:00 UTC) triggers backend CLI tasks
2. **Backend tasks** fetch data from GitHub API and NPM registry, store in PostgreSQL
3. **Static API generation** transforms DB data into JSON files hosted on Vercel
4. **Web app** fetches static JSON (no direct DB access)
5. **Admin app** has direct DB access for curating projects/tags (local use only)

### Database Schema (`packages/db/src/schema/`)
Key tables: `repos` (GitHub data), `projects` (metadata), `snapshots` (daily star history), `packages` (NPM info), `bundles` (bundle sizes), `tags`, `hall_of_fame`.

### Backend Task Pattern
Tasks are created with a `createTask` factory:
```typescript
export const myTask = createTask({
  name: "my-task",
  run: async ({ db, processRepos, logger }) => { ... }
});
```

## Code Quality

**Biome** (`biome.jsonc`) handles formatting and linting:
- 2-space indent, 80-char line width, LF endings
- Import order: React → NPM → `@repo/*` → aliases → relative
- Kebab-case filenames enforced
- Tailwind class sorting enforced (`useSortedClasses`)

```bash
pnpm biome check --write .   # Auto-fix formatting/lint issues
```

## Key Docs

- `docs/architecture/overview.md` — full system design
- `docs/architecture/backend-app.md` — task system and data collection
- `docs/architecture/web-app.md` — frontend architecture
