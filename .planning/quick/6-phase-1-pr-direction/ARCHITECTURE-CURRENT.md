# Architecture — Current (before Phase 1)

The system today has **no cache layer**. Every listing request reads a daily-built static JSON file into memory and runs mingo (MongoDB-query-compatible) predicates against the array. Trends are computed at JSON-build time, not at query time.

## 1. System context (C4 level 1)

```mermaid
flowchart LR
  GH[GitHub API]
  NPM[npm Registry]
  DB[(PostgreSQL)]
  JSON[(Static JSON<br/>projects.json)]
  USER([User browser])

  BE[Backend<br/>daily tasks]
  WEB[Next.js web app]

  GH  -->|fetch repo info,<br/>stars, commits| BE
  NPM -->|fetch downloads| BE
  BE  -->|write| DB
  BE  -->|build| JSON
  USER -->|HTTPS| WEB
  WEB  -->|load once, cache in-mem| JSON
```

## 2. Container view — backend daily tasks

```mermaid
flowchart TB
  subgraph Backend[apps/backend/src/tasks]
    UG[update-github-data.task]
    UN[update-package-data.task]
    US[update-snapshot.task]
    BSA[build-static-api.task]
  end

  subgraph DB[(PostgreSQL)]
    REPOS[repos]
    PROJS[projects]
    PKGS[packages]
    SNAPS[snapshots]
    TAGS[tags]
  end

  JSON[(projects.json<br/>projects-full.json)]

  UG --> REPOS
  UN --> PKGS
  US --> SNAPS

  BSA -->|read| REPOS
  BSA -->|read| PROJS
  BSA -->|read| PKGS
  BSA -->|read| SNAPS
  BSA -->|read| TAGS
  BSA -->|computeTrends per repo<br/>at build time| BSA
  BSA -->|write| JSON
```

## 3. Read path — web request

```mermaid
sequenceDiagram
  participant U as User
  participant Page as Server Component<br/>(/projects, /(home))
  participant API as api-local-json /<br/>api-remote-json
  participant Cache as In-memory singleton
  participant JSON as projects.json
  participant Mingo as createAPI → mingo

  U->>Page: GET /projects?sort=daily&tags=react
  Page->>API: fetchPageData()
  alt first request
    API->>JSON: load file
    JSON-->>API: ~3.5K project array
    API->>Cache: store singleton
  else subsequent
    API->>Cache: read singleton
  end
  API->>Mingo: findProjects({criteria, sort, skip, limit})
  Mingo->>Mingo: mingo.find(criteria).sort().slice()
  Mingo-->>Page: {projects, total, tags}
  Page-->>U: HTML
```

## 4. Domain concepts already in the code

```mermaid
classDiagram
  class Repo {
    +id : text PK
    +owner, name
    +stargazers_count
    +commit_count
    +contributor_count
    +last_commit
  }

  class Snapshot {
    +repoId + year PK (composite)
    +months JSONB
  }

  class Project {
    +id : text PK
    +slug, name, description
    +status : active/featured/promoted/deprecated/hidden
    +repoId FK
  }

  class Package {
    +id PK
    +projectId FK
    +name
    +monthlyDownloads
  }

  class Tag {
    +id PK
    +code, name
  }

  class ProjectsToTags {
    +projectId FK
    +tagId FK
  }

  Repo "1" --> "N" Snapshot : has
  Repo "1" --> "N" Project : shared by (monorepo)
  Project "1" --> "N" Package : has
  Project "N" --> "N" Tag : via ProjectsToTags
```

## 5. Where the work lives today

```mermaid
flowchart LR
  subgraph packages_db[packages/db/src/]
    schema[schema/<br/>repos projects packages snapshots tags]
    snapshots_mod[snapshots/<br/>computeTrends, flattenSnapshots]
    projects_mod[projects/<br/>find.ts, project-helpers.ts<br/><i>contains getPackageData bug</i>]
  end

  subgraph backend[apps/backend/src/]
    tasks[tasks/<br/>build-static-api.task.ts<br/><i>shouldIncludeProjectInMainList</i><br/><i>isColdProject, isPopularPackage...</i>]
  end

  subgraph web[apps/web/src/server/]
    api_local[api-local-json.ts]
    api_remote[api-remote-json.ts]
    create_api[create-api.tsx<br/>+ mingo]
  end

  tasks --> snapshots_mod
  tasks --> projects_mod
  tasks -->|writes| JSON[(projects.json)]
  create_api -->|reads once| JSON
  api_local --> create_api
  api_remote --> create_api
```

## 6. Pain points this architecture creates

| Pain | Where it shows up |
|---|---|
| Every request loads the full ~3.5K project array into memory | `api-local-json.ts`, `api-remote-json.ts` |
| Sort/filter pushed through mingo — no DB index use | `create-api.tsx` → `api-projects.tsx` |
| Trend computation is tied to JSON build time — can't recompute without rebuilding JSON | `build-static-api.task.ts` → `computeTrends` |
| "Primary package" is implicitly `packages[0]` (array order), not max-downloads | `project-helpers.ts:71` `getPackageData` |
| Eligibility predicates are scattered ad-hoc `is*` functions, not a named Specification | `build-static-api.task.ts` `isCold*/isInactive*/isPromoted*/isFeatured*` |
| `relevanceScore` means "text-match rank" in `find.ts:168` — will collide with Phase 1's quality-floor meaning | `packages/db/src/projects/find.ts` |
