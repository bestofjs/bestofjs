import { cacheTag as nextCacheTag } from "next/cache";

import type { WebApp } from "@/config/apps";

/**
 * `cacheTag`, with the deployment's `app` appended. Use this — not
 * `next/cache`'s `cacheTag` — at any `"use cache"` site whose result depends
 * on this deployment's excluded tags (i.e. anything that reads through
 * `@/app/db` or the static-JSON collection in `@/server/api`).
 *
 * Why `app` must be a real function parameter of the cached function, not a
 * module-scope import: Next's `"use cache"` excludes module-scope values from
 * the cache key (github.com/vercel/next.js#74498). This wrapper makes the
 * common mistake — forgetting to key by deployment — a compile error rather
 * than a silent one: a cached function that omits `app` from its signature
 * has no `app` in scope to pass here.
 *
 * Note: this guards the tag, not the parameter. A cached function that closes
 * over the module-scope `currentApp` instead of taking `app` as an argument
 * still compiles — and still re-introduces the bug, since `currentApp` is
 * excluded from the key. The page-split pattern (`renderX(currentApp)` →
 * `renderXInner(app, …)`) is what keeps `app` a parameter; keep it.
 */
export function cacheTagForApp(app: WebApp, ...tags: string[]) {
  return nextCacheTag(...tags, app);
}
