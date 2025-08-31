## Backend Application

The Backend Application in Best of JS is responsible for collecting, processing, and serving data about JavaScript projects. It fetches data from external sources like GitHub and NPM, updates the PostgreSQL database, generates static API files, and sends notifications about trending projects. This document describes the architecture and operation of the backend application.

## Architecture Overview

The Backend Application is structured around a task-based command-line interface that executes various data operations. These operations include fetching GitHub stars, collecting NPM package data, generating static JSON files, and triggering builds.

## CLI System

The Backend Application is driven by a command-line interface built with the `cleye` library, which provides a way to define and execute commands. The CLI entry point defines all available tasks and their command-line arguments.

The CLI system provides flags that can be passed to all commands, such as:

| Flag | Type | Description |
| --- | --- | --- |
| `concurrency` | Number | Number of items to process concurrently |
| `dryRun` | Boolean | Execute without making changes |
| `logLevel` | Number | Control verbosity (3=info, 4=debug) |
| `limit` | Number | Limit number of records to process |
| `skip` | Number | Skip records for pagination |
| `throttleInterval` | Number | Milliseconds to wait between API calls |

The core CLI definition can be found in the main CLI file.

## Task Runner System

The Task Runner is the core execution engine for the backend application. It provides a consistent environment for tasks to run with proper database access, logging, and other utilities.

### Task Creation and Execution

Tasks are created using the `createTask` function and executed by the Task Runner.

The Task Runner provides a standardized context for all tasks that includes:

1. Database Connection: Access to the PostgreSQL database
2. Logger: Structured logging at configurable levels
3. Process Helpers: Functions to process database entities in a consistent way
4. File System Helpers: Functions to read and write JSON files

## Data Collection Tasks

The Backend Application includes several tasks that collect data from external sources.

### GitHub Data Collection

The `update-github-data` task fetches repository information from GitHub, including star counts, contributor counts, and other metadata. It also creates daily snapshots of star counts to track trends over time.

### NPM Package Data Collection

The `update-package-data` task fetches information about NPM packages associated with projects, including:

- Current version
- Monthly download count
- Dependencies
- Deprecated status

This information is stored in the database for use in generating the static API.

### Bundle Size Collection

The `update-bundle-size` task fetches bundle size information for packages using the bundlejs.com API. This data helps users understand the impact of including a library in their projects.

The task skips packages that are backend-only or don't run in browsers.

## Static API Generation

One of the most important functions of the Backend Application is to generate static JSON files that power the frontend application.

### Build Static API Task

The `build-static-api` task processes project data from the database and generates JSON files containing:

- Project metadata (name, description, URL)
- Star counts and trends
- Tags and categorization
- Package information
- Bundle size data

The generated JSON files are:

1. projects.json: Contains actively maintained and popular projects for the main site
2. projects-full.json: Contains all projects, including less active ones

These files are hosted as static assets and used by the web application.

## Rankings and Trends

The Backend Application generates various rankings and trend data.

### Monthly Rankings

The `build-monthly-rankings` task creates monthly rankings of projects based on their star growth:

1. Projects by absolute growth (most stars added)
2. Projects by relative growth (percentage increase)

These rankings are saved as static JSON files for the frontend application to display.

## Notifications

The Backend Application sends notifications to Slack and Discord when new data is available.

### Daily Notifications

The `notify-daily` task sends notifications about the top trending projects of the day to both Slack and Discord. This happens after the static API is built.

### Monthly Notifications

The `notify-monthly` task sends notifications about the top projects of the month to Discord. This happens after monthly rankings are built.

## Scheduled Execution

The Backend Application tasks are typically executed on a schedule via GitHub Actions workflows.

### Daily Update Workflow

The `update-github-data` workflow runs daily to:

1. Update GitHub data for all projects
2. Generate new snapshots for trend tracking
3. Build the static API
4. Trigger a rebuild of the web application

This workflow is scheduled to run at 21:00 UTC daily (via a cron expression) and can also be triggered manually via the GitHub UI.

## Item Processors

The Backend Application uses a set of processors to handle different types of entities consistently.

### Process Abstraction

Three main processor classes handle the iteration through database items:

1. ProjectProcessor: Processes project entities
2. RepoProcessor: Processes repository entities
3. HallOfFameProcessor: Processes hall of fame members

These processors share the same abstract base class (ItemProcessor) which provides:

- Pagination support
- Concurrency control
- Error handling
- Result aggregation
- Throttling for API calls

## Deployment

The Backend Application is deployed on Vercel as a serverless application. The build output is served as a static API with appropriate CORS headers.

The deployment configuration specifies:

- Routes for serving JSON files
- CORS headers to allow cross-origin access
- Deployment constraints (disabled automatic deploys)

## Task System

The Task System is the core execution framework of Best of JS's backend application. It provides a structured way to define, schedule, and execute data operations that keep the system up-to-date with GitHub stars, NPM package information, and other metadata for JavaScript projects.

## 1. Architecture Overview

The Task System follows a modular architecture that enables the execution of scheduled tasks both manually through a CLI and automatically via scheduled GitHub Actions workflows.

## 2. Task Definition

Tasks are defined using the `createTask` function, which standardizes task structure and provides type safety. Each task has a name, description, optional flags and schema, and a run function that contains the task's logic.

### 2.1 Task Definition Example

```
export const updateGitHubDataTask = createTask({
  name: "update-github-data",
  description: "Update GitHub data for all repos and take a snapshot. To be run run every day",
  run: async ({ db, processRepos, logger }) => {
    // Task implementation
  },
});
```

## 3. Task Runner

The Task Runner is responsible for executing tasks with the appropriate context and handling task flow. It manages database connections, logging, and provides utility functions to tasks.

## 4. Item Processors

The Task System uses specialized processors to handle different types of data operations. These processors provide a uniform interface for iterating through collections of items with support for concurrency, throttling, and error handling.

### 4.1 Item Processing Flow

The `processItems` method in each processor handles the iteration over collections with support for concurrency and throttling.

## 5. Available Tasks

The system includes several task types that serve different purposes:

| Task Category | Task Name | Description | File Location |
| --- | --- | --- | --- |
| **Data Updates** | update-github-data | Updates GitHub star counts and metadata | [apps/backend/src/tasks/update-github-data.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/update-github-data.task.ts) |
|  | update-package-data | Updates NPM package information | [apps/backend/src/tasks/update-package-data.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/update-package-data.task.ts) |
|  | update-bundle-size | Updates bundle size information | [apps/backend/src/tasks/update-bundle-size.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/update-bundle-size.task.ts) |
| **API Generation** | build-static-api | Builds JSON files for the Static API | [apps/backend/src/tasks/build-static-api.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/build-static-api.task.ts) |
|  | build-monthly-rankings | Creates monthly project rankings | [apps/backend/src/tasks/build-monthly-rankings.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/build-monthly-rankings.task.ts) |
| **Notifications** | notify-daily | Sends daily notifications to Slack/Discord | [apps/backend/src/tasks/notify-daily.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/notify-daily.task.ts) |
|  | notify-monthly | Sends monthly rankings notifications | [apps/backend/src/tasks/notify-monthly.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/notify-monthly.task.ts) |
| **Deployment** | trigger-build-webapp | Triggers rebuilding of the web app | [apps/backend/src/tasks/trigger-build-webapp.task.ts](https://github.com/bestofjs/bestofjs/blob/a93905ae/apps/backend/src/tasks/trigger-build-webapp.task.ts) |

## 6. CLI Integration

The Task System integrates with a CLI built using the Cleye library, where each task is registered as a command.

## 7. Task Scheduling

Tasks are scheduled and executed through GitHub Actions workflows.

## 8. Task Execution Lifecycle

This section outlines the complete lifecycle of a task execution at a high level.

## 9. Example: Daily Update Pipeline

The daily update pipeline combines multiple tasks to update data and rebuild the static API.

## 10. Configuration and CLI Flags

The Task System supports a standard set of configuration flags that control execution behavior:

| Flag | Type | Description | Default |
| --- | --- | --- | --- |
| concurrency | Number | Number of items to process concurrently | 1 |
| dryRun | Boolean | Run without making changes | false |
| logLevel | Number | Log level (0-5, from error to trace) | 3 |
| limit | Number | Maximum items to process | 0 (no limit) |
| skip | Number | Number of items to skip | 0 |
| throttleInterval | Number | Milliseconds between API calls | 0 |
| slug | String | Process only a specific project | undefined |
| fullName | String | Process only a specific repo by full name | undefined |

## 11. Task System Implementation Details

The Task System is designed to be extensible, with a focus on:

1. Type Safety: Using TypeScript and Zod schemas for command-line arguments
2. Reusable Processors: Shared logic for handling different data types
3. Throttling: API rate limit management
4. Concurrency: Parallel processing with error isolation
5. Standardized Logging: Consistent logging across all tasks
6. File System Helpers: Common utilities for reading/writing JSON files

Each task follows the same pattern, leveraging these shared facilities to ensure consistent behavior and error handling across the system.

## Data Collection

This document details how the Best of JS backend collects data from external sources such as GitHub and npm. It focuses on the specific tasks responsible for gathering project metadata, star counts, package information, and bundle sizes.

## Overview

The Best of JS system collects data from multiple sources to track JavaScript project trends. Data collection is implemented through dedicated tasks that fetch information from external APIs and update the database accordingly.

## Data Collection Tasks

The system employs three main data collection tasks:

### GitHub Data Collection

The `updateGitHubDataTask` fetches repository information from GitHub, including:

- Star counts
- Repository metadata (description, topics, etc.)
- Contributor counts
- Whether the repository is archived

This task also creates daily snapshots of star counts, enabling the tracking of historical trends.

### NPM Package Data Collection

The `updatePackageDataTask` retrieves package information from the npm registry, including:

- Latest version
- Dependencies
- Monthly download count
- Deprecation status

### Bundle Size Data Collection

The `updateBundleSizeTask` gathers bundle size information from bundlejs.com for packages that can run in browsers. It:

- Checks if a package is frontend-compatible (not a backend-only package)
- Verifies if the package needs an update (version changed)
- Fetches size and gzip size data
- Updates the database

## Iteration Helpers

To efficiently process collections of items, the system employs specialized processors:

### Project and Repository Processors

The `ProjectProcessor` and `RepoProcessor` classes extend an abstract `ItemProcessor` class and handle the iteration over projects and repositories respectively. They provide:

- Batch processing of items
- Error handling
- Progress tracking
- Throttling to prevent API rate limits

## Data Storage

After collection, data is stored in the PostgreSQL database using the schemas defined in the `@repo/db` package. Key tables include:

| Table | Description | Updated by |
| --- | --- | --- |
| repos | Repository information from GitHub | updateGitHubDataTask |
| projects | Project metadata and relationships | Various tasks |
| packages | NPM package information | updatePackageDataTask |
| bundles | Bundle size information | updateBundleSizeTask |
| snapshots | Historical star count records | updateGitHubDataTask |

## Tracking Project Trends

A key feature of the data collection system is tracking project popularity over time. This is implemented through:

1. Daily snapshots of star counts stored in the `snapshots` table
2. Monthly rankings generated from these snapshots

The `buildMonthlyRankingsTask` processes this historical data to generate:

- Trending projects by absolute star growth
- Growing projects by relative growth rate

## Task Execution Details

The data collection tasks are created using the `createTask` factory function and follow a common pattern:

1. Define task metadata (name, description)
2. Implement a `run` function that:
	- Creates API clients
	- Uses processors to iterate over items
	- Updates database records
	- Returns results

Each task is designed to be:

- Idempotent - can be run multiple times without side effects
- Resilient - handles errors gracefully and continues processing
- Observable - logs progress and results

## Integration with Other Systems

The data collection tasks integrate with other components:

- Database package (`@repo/db`): For schema definitions and database operations
- API package (`@repo/api`): For client implementations to external APIs
- Task runner: For scheduling and executing tasks
- Notification systems: To alert about significant changes or new projects

These tasks are typically run on a scheduled basis (daily) via GitHub Actions workflows to ensure data freshness.

## Static API Generation

The Static API Generation system is a core component of the bestofjs platform that transforms project data from the database into static JSON files. These files serve as the primary data source for the web frontend applications, providing an efficient way to deliver project listings, metadata, and trend data without requiring direct database access.

## Purpose and Overview

The Static API generation process serves several key purposes:

1. Performance optimization - Pre-computed JSON files can be served quickly without database queries
2. Global distribution - Static files can be hosted on CDNs for efficient global access
3. Simplification - Frontend applications can consume simple JSON structures instead of complex database queries
4. Decoupling - Backend data processing is isolated from frontend consumption

## Static API Implementation

The Static API generation is implemented as a task within the backend application's task system. The main implementation is in the `buildStaticApiTask` function.

### Project Item Creation

The core of the Static API generation is the transformation of database project records into structured JSON objects. This happens in the `buildProjectItem` function.

### Project Filtering Logic

Not all projects are included in the main API list. The system employs several filtering rules to curate projects:

| Filter | Purpose | Implementation |
| --- | --- | --- |
| Status filter | Exclude deprecated/hidden projects | Filter by `status` not in `["deprecated", "hidden"]` |
| Trend data filter | Ensure projects have trend data | `project.trends.daily !== undefined` |
| Cold project filter | Remove projects with little growth | `delta < 50` for yearly growth and not a popular package |
| Inactive project filter | Remove abandoned projects | No commits in over a year and low growth rate |
| Promotion exception | Keep important projects | Projects with `status === "promoted"` bypass other filters |

## Generated API Structure

The Static API generation produces two main JSON files:

1. projects.json - Contains active, trending, and promoted projects along with tag metadata
2. projects-full.json - Contains a complete list of all non-deprecated/non-hidden projects

Example structure of the generated `projects.json`:

```
{
  "date": "2024-06-01T00:00:00.000Z",
  "tags": [
    { "name": "React", "code": "react", "description": "React library and tools" },
    { "name": "Vue", "code": "vue", "description": "Vue.js framework and ecosystem" }
    // Additional tags...
  ],
  "projects": [
    {
      "name": "Next.js",
      "slug": "nextjs",
      "added_at": "2020-01-01",
      "description": "The React Framework for Production",
      "stars": 75000,
      "full_name": "vercel/next.js",
      "owner_id": "vercel",
      "status": "active",
      "tags": ["react", "framework"],
      "trends": {
        "daily": 120,
        "weekly": 800,
        "monthly": 3500,
        "yearly": 25000
      },
      "contributor_count": 1800,
      "pushed_at": "2024-06-01",
      "created_at": "2016-10-05",
      "url": "https://nextjs.org",
      "logo": "nextjs.svg",
      "downloads": 5000000
    }
    // Additional projects...
  ]
}
```

## Automation and Workflow Integration

The Static API is automatically generated through scheduled tasks.

## Deployment and Hosting

The generated Static API files are deployed to Vercel, which hosts them as static assets and serves them with proper CORS headers.

The Vercel configuration creates routes that serve the JSON files with appropriate headers:

| Route | Source | Description |
| --- | --- | --- |
| `/` | `/build/` | Base directory listing |
| `/(.+json)` | `/build/$1` | JSON files with CORS headers |

## Notification System

After the Static API is generated, the system automatically sends notifications to Slack and Discord with the trending projects data.

The notification system:

1. Reads the generated projects.json file
2. Extracts the top trending projects based on daily star count
3. Formats messages with project details and statistics
4. Sends notifications to configured webhook endpoints

## Task Runner Integration

The Static API generation is implemented as a task in the backend's task runner system, which provides:

- Standardized logging and error handling
- Database access and transaction management
- File system operations for JSON processing
- Concurrency controls and rate limiting
- Command-line interface for manual execution

The task can be run via the CLI using:

```
pnpm -F backend build-static-api
```

It can also be run as part of the daily update process:

```
pnpm -F backend static-api-daily
```

## Conclusion

The Static API Generation system serves as a crucial bridge between the database backend and frontend applications in the bestofjs platform. By generating optimized, pre-computed JSON files, it enables efficient global distribution of project data while simplifying frontend development and improving application performance.

The system is fully automated through scheduled workflows, ensuring that the API is regularly updated with the latest project data and trends.
