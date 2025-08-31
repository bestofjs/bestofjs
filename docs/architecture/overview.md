## Project Architecture

This document provides a comprehensive overview of the Best of JS system architecture, explaining how the different components interact to track and showcase JavaScript ecosystem trends. It covers the monorepo structure, data flow between applications, backend task system, and database design.

## Monorepo Structure

Best of JS is structured as a monorepo containing multiple applications and shared packages. This architecture promotes code reuse while allowing each application to serve its specific purpose within the larger system.

### Applications and Packages

| Component | Description | Primary Purpose |
| --- | --- | --- |
| Admin App | Next.js application | Manage projects, tags, and metadata |
| Backend App | Node.js application | Collect data, generate APIs, run scheduled tasks |
| Web App | Next.js application | Public-facing website showing project stats |
| Legacy App | Older React application | Previous version of the web interface |
| @repo/api Package | Shared utilities | API interfaces and utility functions |
| @repo/db Package | Database access | Schema definitions and database operations |

The build process is managed by Turbo, which orchestrates building the applications and packages in the correct order, as defined in the root `package.json`.

## Data Flow Architecture

Best of JS collects, processes, and presents data about JavaScript projects through a multi-stage pipeline. The system uses a combination of scheduled tasks, database storage, and static file generation to efficiently deliver project information.

### Key Data Flow Processes

1. **Data Collection**: Backend app fetches data from GitHub API (star counts, repo metadata) and NPM Registry (package details, download counts)
2. **Data Storage**: Information is processed and stored in a PostgreSQL database
3. **Static API Generation**: Backend generates static JSON files for efficient data delivery
4. **Presentation**: Web app consumes static API data to present project information
5. **Management**: Admin app directly interacts with the database for content management

The backend task system orchestrates these processes through scheduled workflows, ensuring data is regularly updated and available.

## Backend Task System

The backend application implements a task-based architecture to manage various data operations. Each task is a discrete unit of functionality that can be executed independently or as part of a workflow.

### Task System Architecture

The backend task system is built around the following key components:

1. **CLI Interface**: Entry point for running tasks through command-line [apps/backend/src/cli.ts 1-81](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/cli.ts#L1-L81)
2. **Task Runner**: Manages task execution and provides context [apps/backend/src/task-runner.ts 17-38](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/task-runner.ts#L17-L38)
3. **Task Definition**: Structure defining a task's behavior and parameters [apps/backend/src/task-types.ts 14-26](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/task-types.ts#L14-L26)
4. **Processors**: Helpers for iterating through different data types [apps/backend/src/task-types.ts 36-40](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/task-types.ts#L36-L40)

Tasks are defined using the `createTask` factory function, which standardizes task creation:

```
createTask({
  name: "task-name",
  description: "Task description",
  flags: {/* command flags */},
  schema: z.object({/* flag validation */}),
  run: async (context, flags) => {
    // Task implementation
    return { data: result, meta: { processed: true } };
  }
})
```

The task system supports features like:

- Concurrency control for processing multiple items
- Dry run mode for testing
- Configurable logging
- Pagination through limit/skip parameters

## Database Architecture

Best of JS uses a PostgreSQL database to store project data, GitHub repository information, and related metadata. The database schema is defined using Drizzle ORM.

### Database Tables and Relationships

| Table | Purpose | Key Fields | Relationships |
| --- | --- | --- | --- |
| repos | GitHub repository data | id, full\_name, stargazers\_count | Has many projects and snapshots |
| projects | Project information | id, name, slug, status | Belongs to a repo, has many packages, relates to many tags |
| snapshots | Historical star counts | repo\_id, year, months (JSON) | Belongs to a repo |
| packages | NPM package data | name, project\_id, downloads | Belongs to a project, has many bundles |
| bundles | Package bundle size | name, size, gzip | Belongs to a package |
| tags | Categories for projects | id, code, name | Many-to-many with projects |

The PostgreSQL database is accessed through the `@repo/db` package, which provides database connection handling, schema definitions, and utility functions for common database operations.

Sources: [packages/db/package.json 14-23](https://github.com/bestofjs/bestofjs/blob/a93905ae/packages/db/package.json#L14-L23) [packages/db/drizzle/meta/0000\_snapshot.json 1-581](https://github.com/bestofjs/bestofjs/blob/a93905ae/packages/db/drizzle/meta/0000_snapshot.json#L1-L581)

## Static API Generation

A key architectural feature of Best of JS is the generation of static JSON files that serve as the API for the frontend applications. This approach improves performance and reduces database load.

The static API generation process:

1. **Data Retrieval**: Fetch project data from the database including repos, snapshots, tags, and packages
2. **Processing**: Transform database records into the API format with calculated trend data
3. **Filtering**: Remove inactive or cold projects from the main API file
4. **Output**: Generate JSON files with formatted data
5. **Notification**: Trigger notifications and webapp rebuild

The static API files are hosted on Vercel and served with CORS headers to allow access from the frontend application.

## Scheduled Tasks and Automation

Best of JS relies on automated workflows to keep data fresh and notify users of trending projects. These workflows are primarily implemented through GitHub Actions.

### Key Scheduled Tasks

| Task | Schedule | Purpose | Implementation |
| --- | --- | --- | --- |
| Update GitHub Data | Daily (21:00 UTC) | Fetch latest star counts and repo data | GitHub Action + Backend Task |
| Update Package Data | Daily | Fetch latest NPM package information | Backend Task |
| Build Static API | After data updates | Generate static JSON files | Backend Task |
| Daily Notifications | After API build | Send trending projects to Slack/Discord | Backend Task |
| Monthly Rankings | Monthly | Generate and publish monthly rankings | Backend Task |

The scheduled tasks can also be manually triggered through the CLI for testing or ad-hoc updates:

```
pnpm -F backend daily-update-github-data
pnpm -F backend daily-update-package-data
pnpm -F backend static-api-daily
```

## Summary

The Best of JS architecture is built around a clear separation of concerns:

1. **Data Collection**: Backend tasks collect data from GitHub and NPM
2. **Data Storage**: PostgreSQL database stores normalized data
3. **API Generation**: Static JSON files serve as the API
4. **Presentation**: Web application consumes the static API
5. **Management**: Admin application manages content directly through the database

This architecture provides several benefits:

- Improved performance through static API files
- Reduced database load in production
- Clear separation of concerns between applications
- Efficient data collection through scheduled tasks
- Scalable approach to tracking thousands of projects

The monorepo structure with shared packages promotes code reuse and maintainability across the different applications that make up the Best of JS ecosystem.
