import { rebuildTagClosure } from "@repo/core/services/tags";

import { createTask } from "@/task-runner";

export const rebuildTagClosureTask = createTask({
  name: "rebuild-tag-closure",
  description:
    "Validate tag parent state and rebuild the derived tag closure index.",
  run: async ({ db }) => {
    const rows = await db.transaction((tx) => rebuildTagClosure(tx));
    return { data: null, meta: { rows: rows.length } };
  },
});
