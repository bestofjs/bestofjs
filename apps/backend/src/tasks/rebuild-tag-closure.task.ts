import {
  deriveTagClosure,
  lockTagTaxonomy,
  rebuildTagClosure,
} from "@repo/core/services/tags";

import { createTask } from "@/task-runner";

export const rebuildTagClosureTask = createTask({
  name: "rebuild-tag-closure",
  description:
    "Validate tag parent state and rebuild the derived tag closure index.",
  run: async ({ db, dryRun }) => {
    const rows = dryRun
      ? await deriveTagClosure(db)
      : await db.transaction(async (tx) => {
          await lockTagTaxonomy(tx);
          return await rebuildTagClosure(tx);
        });
    return { data: null, meta: { rows: rows.length, updated: !dryRun } };
  },
});
