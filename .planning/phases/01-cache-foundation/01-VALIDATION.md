---
phase: 1
slug: cache-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | bun:test (bundled with Bun runtime) |
| **Config file** | None needed — bun:test works out of the box |
| **Quick run command** | `cd packages/db && bun test src/scores/` |
| **Full suite command** | `cd packages/db && bun test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd packages/db && bun test src/scores/`
- **After every plan wave:** Run `cd packages/db && bun test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-02-01 | 02 | 1 | SCORE-01 | unit | `cd packages/db && bun test src/scores/popularity.test.ts` | W0 | pending |
| 01-02-02 | 02 | 1 | SCORE-02 | unit | `cd packages/db && bun test src/scores/activity.test.ts` | W0 | pending |
| 01-02-03 | 02 | 1 | SCORE-03 | unit | `cd packages/db && bun test src/scores/usage.test.ts` | W0 | pending |
| 01-02-04 | 02 | 1 | SCORE-04 | unit | `cd packages/db && bun test src/scores/relevance.test.ts` | W0 | pending |
| 01-02-05 | 02 | 1 | CACHE-05 | unit | `cd packages/db && bun test src/scores/primary-package.test.ts` | W0 | pending |
| 01-03-01 | 03 | 2 | CACHE-01 | integration | manual — verify repo_trends populated after refresh | N/A | pending |
| 01-03-02 | 03 | 2 | CACHE-02 | integration | manual — verify project_trends populated after refresh | N/A | pending |
| 01-03-03 | 03 | 2 | CACHE-04 | integration | manual — verify row count matches unique repos | N/A | pending |
| 01-03-04 | 03 | 2 | DATA-01 | integration | manual — verify deprecated repos absent from repo_trends | N/A | pending |
| 01-04-01 | 04 | 2 | SCORE-01..04, CACHE-05 | integration | `cd /home/ubuwarudo/Project/PERSONAL/dev/bestofjs && grep -c '"./scores"' packages/db/package.json` | N/A | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `packages/db/src/scores/popularity.test.ts` — covers SCORE-01
- [ ] `packages/db/src/scores/activity.test.ts` — covers SCORE-02
- [ ] `packages/db/src/scores/usage.test.ts` — covers SCORE-03
- [ ] `packages/db/src/scores/relevance.test.ts` — covers SCORE-04
- [ ] `packages/db/src/scores/primary-package.test.ts` — covers CACHE-05

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| repo_trends populated for all active repos | CACHE-01, CACHE-03 | Requires live DB with snapshot data | Run refresh task, query `SELECT COUNT(*) FROM repo_trends` |
| project_trends populated for all active projects | CACHE-02, CACHE-03 | Requires live DB with project data | Run refresh task, query `SELECT COUNT(*) FROM project_trends` |
| Monorepo dedup (one row per repo) | CACHE-04 | Requires live DB with monorepo siblings | Check `SELECT repo_id, COUNT(*) FROM repo_trends GROUP BY repo_id HAVING COUNT(*) > 1` returns 0 rows |
| Deprecated repos excluded | DATA-01 | Requires live DB with deprecated projects | Check `SELECT rt.repo_id FROM repo_trends rt JOIN projects p ON p."repoId" = rt.repo_id WHERE p.status = 'deprecated'` returns 0 rows |
| Primary package = highest downloads | CACHE-05 | Edge case verification | For a multi-package project, verify `project_trends.package_name` matches highest downloads |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
