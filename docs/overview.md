# Best of JS project overview

Best of JS gathers the best projects from the JavaScript ecosystem and web platform: TypeScript, CSS, Node.js, frameworks (React, Vue, Angular), libraries, tools, runtimes (Bun, Deno)...

The goal is to help developers:
- understand the trends
- explore the ecosystem
- find the best tools to address web application needs

The problem it tries to solve: the landscape keeps evolving, and what was relevant a few months ago can become deprecated without any official notice. Best of JS shows trending projects and filters them based on several criteria.

At its core, Best of JS is a curated list of about 3000 projects, carefully classified under meaningful tags (tagging correctly being one of the most difficult tasks!).

It provides insights about trends on GitHub, download numbers, dependencies... the goal is to provide a valuable tool for all developers.

## Concept / How it works

I maintain a list of projects related to JavaScript and the web platform in a database.

Every time we find a new interesting project on GitHub (based on suggestions, newsletters, posts...), I add it to the database.

Then every day, an automatic task checks project data from GitHub for every stored project and generates data consumed by the web application.

The web application displays the total number of stars and their variation over the last days.
When projects lose traction, they are automatically filtered out and don't show up anymore in the web application.
  
## Components

The main parts are split into different workspaces in the monorepo:

```shell
├── apps
│   ├── admin
│   ├── backend
│   ├── web
│   └── legacy
└── packages
    ├── api
    └── db
```

### `web` app

The main web application is built with Next.js and available at https://bestofjs.org
Features:
- Home page showing the daily trends (projects by number of stars added over the last 24 hours), the latest additions, and the most popular tags
- Search palette available from Cmd+K, giving fast access to project pages, GitHub repos, and project websites
- Tags pages to show lists of projects filtered by tags
- Hall of Fame showing a list of famous GitHub profiles we maintain

### `admin` app

Used only by Best of JS creators to manage projects. Not deployed, runs only locally.
Features:
- Add projects by entering a repository URL
- Edit projects (especially project status)
- Add tags to projects
- Add NPM packages to projects
- Add Hall of Fame members
- Search

### `backend` tasks

Several CRON jobs run every day on GitHub Actions:
- `update-github-data`: updates `repository` and `snapshots` records, accessing the GitHub API

### `core` package

- Database setup (Postgres with Drizzle ORM)
- Services layer to access database (example: a project service to query projects and get all related data)
