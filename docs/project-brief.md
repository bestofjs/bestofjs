# Best of JS — Project Brief

## Overview

Best of JS is a curated, up‑to‑date repository of the most relevant projects in the JavaScript and web platform ecosystem. It helps developers understand trends, explore tools, and find the best solutions across frameworks, libraries, runtimes, and tooling. The platform combines curated content with data signals (e.g., GitHub activity) and presents daily insights via the public web app.

This brief synthesizes the project’s purpose and scope using the existing repository context (see `docs/overview.md`) and follows the structure of the Best of JS overview described in the product wiki.

## Project Goals

- **Curated repository**: Maintain a comprehensive and trustworthy catalog of high‑quality JavaScript and web projects.
- **Community engagement**: Foster discovery and sharing around relevant projects and trends.
- **Developer resource**: Provide reliable insights about technologies and their momentum to support informed adoption decisions.

## Target Users

- **JavaScript developers** evaluating tools, frameworks, and libraries for their projects.
- **Project maintainers** seeking visibility and comparative context within the ecosystem.
- **Tech enthusiasts/learners** tracking trends and emerging technologies.

## Success Metrics

- **User engagement**: Return usage, project page views, search interactions.
- **Catalog quality and coverage**: Growth and diversity of curated projects and tags.
- **Community signals**: Volume/quality of suggestions and corrections; external references.

## Key Features

### Current

- **Curated catalog (~3,000 projects)** with meaningful, maintained tagging.
- **Daily trend insights** sourced from GitHub; projects losing traction fade from listings automatically.
- **Search and navigation** including a fast search palette (Cmd+K), tag pages, and project pages.
- **Featured and rankings views** highlighting daily movers, latest additions, and popular tags.
- **Hall of Fame** showcasing notable GitHub profiles maintained by the project.
- **Admin app (local use)** for creators to add/edit projects, manage tags, and attach npm packages.

### Planned/Exploratory (subject to validation)

- **Enhanced community participation** (e.g., richer suggestion workflows, feedback loops).
- **Deeper project insights** beyond stars (downloads, dependencies, health signals) as data allows.

## How It Works (Data Flow)

1. Curators add interesting projects (from suggestions, newsletters, posts…).
2. Automated jobs run daily to refresh GitHub data for each project and generate the data consumed by the web app.
3. Display logic surfaces total stars and recent deltas; projects that lose traction are filtered out of primary views over time.

## Technical Stack

- **Frontend**: Next.js (React) web application (`apps/web`).
- **Backend jobs**: Node.js tasks and scripts (`apps/backend`) to fetch, process, and publish data.
- **Database**: PostgreSQL with Drizzle ORM (`packages/db`).
- **Services/Packages**: Internal `packages/api` for integrations (e.g., GitHub API).
- **Hosting/Operations**: Cloud deployment for the web app; scheduled jobs via CI (e.g., GitHub Actions) for daily updates.

## Timeline (High-Level)

- **Phase 1 — Core platform**: Curated listings, daily data ingestion, public web UI with search, tags, and project pages.
- **Phase 2 — Advanced features**: Richer rankings, expanded insights, improved discovery and curation workflows.
- **Phase 3 — Community & growth**: Community programs, content, and continuous improvement based on feedback.

## Risks and Mitigation

- **Data accuracy and freshness**: Use official APIs (e.g., GitHub); monitor jobs; add manual review for edge cases.
- **User engagement**: Emphasize timely, useful insights; improve discovery UX; maintain editorial quality.
- **Scalability and performance**: Optimize data pipelines and queries; scale read paths and caching with growth.

## References

- Internal overview: see `docs/overview.md`.
- Public product overview: see the Best of JS overview in the product wiki.


