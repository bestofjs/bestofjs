import { z } from "zod";

import { Task } from "@/task-runner";

const schema = z.object({ year: z.number(), month: z.number() });

export const buildMonthlyRankingsTask: Task<z.infer<typeof schema>> = {
  name: "build-monthly-rankings",
  description: "Build monthly rankings",
  flags: {
    year: {
      type: Number,
      description: "Year to build rankings for",
    },
    month: {
      type: Number,
      description: "Month to build rankings for",
    },
  },
  schema,

  async run(_, flags) {
    console.log("Building monthly rankings...", flags);

    return { data: null, meta: { success: true } };
  },
};
