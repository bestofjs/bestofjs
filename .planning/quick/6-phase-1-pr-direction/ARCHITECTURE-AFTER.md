# Architecture — After Phase 1

Phase 1 adds **two cache tables**, a **pure scoring module**, and a **daily refresh task**. The web-app read path is unchanged — it still reads JSON. The cache tables exist and are populated but nothing queries them yet. Phase 2 will wire the read path.

## 1. System context (unchanged at level 1)

```mermaid
flowchart LR
  GH[GitHub API]
  NPM[npm Registry]
  DB[(PostgreSQL<br/>+ repo_trends<br/>+ project_trends)]
  JSON[(Static JSON<br/>still built)]
  USER([User browser])

  BE[Backend<br/>daily tasks<br/>+ refresh-cache.task]
  WEB[Next.js web app<br/>unchanged]

  GH  --> BE
  NPM --> BE
  BE  -->|write| DB
  BE  -->|build| JSON
  USER --> WEB
  WEB  -->|still reads JSON<br/>until Phase 2| JSON
```

## 2. Bounded contexts (new in Phase 1)

```mermaid
flowchart LR
  subgraph PC[PROJECT CATALOG context]
    direction TB
    repos[repos]
    projs[projects]
    pkgs[packages]
    snaps[snapshots]
    tags[tags]
  end

  subgraph TA[TREND ANALYTICS context]
    direction TB
    rt[repo_trends<br/><i>derived/denormalized</i>]
    pt[project_trends<br/><i>derived/denormalized</i>]
    sc[scores/<br/>pure functions<br/><i>cohesive mechanism</i>]
    rc[refresh-cache.task<br/><i>application service</i>]
  end

  rc -.reads.-> repos
  rc -.reads.-> projs
  rc -.reads.-> pkgs
  rc -.reads.-> snaps
  rc -->|upsert| rt
  rc -->|upsert| pt
  rc -->|calls| sc

  rt -.FK cascade.-> repos
  pt -.FK cascade.-> projs

  style TA fill:#e8f4ff,stroke:#4a90e2
  style PC fill:#f5f5f5,stroke:#999
```

**Relationship:** Shared Kernel (same PostgreSQL database). Trend Analytics is a **downstream consumer** — it only reads from Project Catalog. Cache rows are **derived, denormalized data** owned exclusively by Trend Analytics.

## 3. Container view — backend daily tasks

```mermaid
flowchart TB
  subgraph Backend[apps/backend/src/tasks]
    UG[update-github-data.task]
    UN[update-package-data.task]
    US[update-snapshot.task]
    BSA[build-static-api.task<br/><i>unchanged</i>]
    RC[refresh-cache.task<br/><b>NEW</b>]
  end

  subgraph DB[PostgreSQL]
    subgraph ProjectCatalog[Project Catalog]
      REPOS[repos]
      PROJS[projects]
      PKGS[packages]
      SNAPS[snapshots]
    end
    subgraph TrendAnalytics[Trend Analytics]
      RT[repo_trends]
      PT[project_trends]
    end
  end

  JSON[(projects.json<br/>still built)]

  UG --> REPOS
  UN --> PKGS
  US --> SNAPS

  BSA -->|read| ProjectCatalog
  BSA -->|write| JSON

  RC -.read.-> ProjectCatalog
  RC ==>|Pass 1 upsert| RT
  RC ==>|Pass 2 upsert| PT

  style RC fill:#d9f0ff,stroke:#4a90e2,stroke-width:2px
  style RT fill:#d9f0ff,stroke:#4a90e2
  style PT fill:#d9f0ff,stroke:#4a90e2
  style TrendAnalytics fill:#eaf4ff
```

## 4. Module layout — `packages/db/src/`

```mermaid
flowchart TB
  subgraph packages_db[packages/db/src/]
    direction TB

    subgraph schema_mod[schema/]
      s_repos[repos.ts]
      s_projs[projects.ts]
      s_pkgs[packages.ts]
      s_snaps[snapshots.ts]
      s_tags[tags.ts]
      s_rt[<b>repo-trends.ts</b><br/>NEW]
      s_pt[<b>project-trends.ts</b><br/>NEW]
    end

    subgraph scores_mod[<b>scores/ NEW</b>]
      sc_idx[index.ts barrel]
      sc_pop[popularity.ts]
      sc_act[activity.ts]
      sc_use[usage.ts]
      sc_rel[relevance.ts ⚠]
      sc_pp[primary-package.ts]
    end

    subgraph snapshots_mod[snapshots/]
      ct[compute-trends.ts<br/><i>reused</i>]
    end

    subgraph projects_mod[projects/]
      ph[project-helpers.ts<br/><i>flattenSnapshots reused</i>]
      find[find.ts<br/><i>relevanceScore stays as text-match</i>]
    end
  end

  s_rt -.FK.-> s_repos
  s_pt -.FK.-> s_projs

  style scores_mod fill:#d9f0ff,stroke:#4a90e2,stroke-width:2px
  style s_rt fill:#d9f0ff
  style s_pt fill:#d9f0ff
```

`scores/` is a **leaf**. The dashed red line below shows forbidden imports — no arrow from `scores/*` into anything else in the project.

```mermaid
flowchart LR
  RC[refresh-cache.task.ts]
  SC[scores/*]
  SCH_RT[schema/repo-trends.ts]
  SCH_PT[schema/project-trends.ts]
  SCH_R[schema/repos.ts]
  SCH_P[schema/projects.ts]
  CT[snapshots/compute-trends.ts]
  PH[projects/project-helpers.ts]

  RC --> SC
  RC --> SCH_RT
  RC --> SCH_PT
  RC --> CT
  RC --> PH
  SCH_RT -.FK only.-> SCH_R
  SCH_PT -.FK only.-> SCH_P

  SC -. NO IMPORTS .-x SCH_R
  SC -. NO IMPORTS .-x CT

  style SC fill:#d9f0ff,stroke:#4a90e2,stroke-width:3px
```

## 5. Domain model — with derived data boundary

```mermaid
classDiagram
  class Repo {
    <<Aggregate Root>>
    +id
    +stargazers_count
    +last_commit
    +contributor_count
  }
  class Snapshot {
    <<Entity child of Repo>>
    +repoId + year PK
    +months JSONB
  }
  class Project {
    <<Aggregate Root>>
    +id
    +status
    +repoId FK
  }
  class Package {
    <<Entity child of Project>>
    +projectId FK
    +name
    +monthlyDownloads
  }

  class RepoTrends {
    <<Derived Data — NOT aggregate member>>
    +repoId PK
    +stars
    +daily, weekly, monthly, quarterly, yearly
    +popularityScore
    +activityScore
    +refreshedAt
  }
  class ProjectTrends {
    <<Derived Data — NOT aggregate member>>
    +projectId PK
    +packageName
    +monthlyDownloads
    +usageScore
    +relevanceScore
    +refreshedAt
  }

  class TrendDeltas {
    <<Value Object>>
    +daily : number?
    +weekly : number?
    +monthly : number?
    +quarterly : number?
    +yearly : number?
  }

  class ScoresModule {
    <<Cohesive Mechanism>>
    +computePopularityScore(TrendDeltas)
    +computeActivityScore(Date?, number)
    +computeUsageScore(number?)
    +computeRelevanceScore(...)
    +resolvePrimaryPackage(Package[])
  }

  Repo "1" --> "N" Snapshot
  Repo "1" --> "N" Project
  Project "1" --> "N" Package

  Repo ..> RepoTrends : projected to<br/>(derived)
  Project ..> ProjectTrends : projected to<br/>(derived)

  ScoresModule ..> TrendDeltas : consumes
  ScoresModule ..> RepoTrends : populates via refresh
  ScoresModule ..> ProjectTrends : populates via refresh
```

## 6. Refresh task — two-pass sequence

```mermaid
sequenceDiagram
  participant Cron as Daily cron
  participant RC as refresh-cache.task
  participant Spec as EligibleRepoSpec<br/>(SQL WHERE)
  participant DB as PostgreSQL
  participant Sc as scores/ (pure)

  Cron->>RC: run()

  note over RC,DB: PASS 1 — Repos (monorepo dedup by distinct repo_id)
  RC->>Spec: distinct repos with ≥1 eligible project
  Spec-->>RC: [Repo]
  loop for each repo
    RC->>DB: read snapshots for repo
    DB-->>RC: snapshots
    RC->>Sc: computeTrends(flattenSnapshots(…))
    Sc-->>RC: TrendDeltas {daily..yearly}
    RC->>Sc: computePopularityScore(TrendDeltas)
    Sc-->>RC: popularityScore
    RC->>Sc: computeActivityScore(last_commit, contributors)
    Sc-->>RC: activityScore
    RC->>DB: UPSERT repo_trends (repo_id, deltas, scores)
  end

  note over RC,DB: PASS 2 — Projects (depends on Pass 1 scores)
  RC->>Spec: eligible projects (status ∈ active/featured/promoted)
  Spec-->>RC: [Project with packages]
  loop for each project
    RC->>Sc: resolvePrimaryPackage(packages)
    Sc-->>RC: PrimaryPackageInfo
    RC->>Sc: computeUsageScore(monthlyDownloads)
    Sc-->>RC: usageScore
    RC->>Sc: computeRelevanceScore(pop, act, usage, hasPkg)
    Sc-->>RC: relevanceScore
    RC->>DB: UPSERT project_trends
  end

  RC-->>Cron: {reposProcessed, projectsProcessed, errors}
```

## 7. Read path — unchanged in Phase 1

```mermaid
flowchart LR
  U[User] --> WEB[apps/web]
  WEB --> JSON[(projects.json)]
  JSON --> M[mingo query layer]
  M --> Resp[Response]

  DB[(repo_trends<br/>project_trends)]:::new
  DB -. wired up in Phase 2 .- WEB

  classDef new fill:#d9f0ff,stroke:#4a90e2,stroke-width:2px
```

The cache tables exist, are populated, are indexed, and are untouched by any consumer. That is the Phase 1 finish line.
