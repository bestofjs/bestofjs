import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { projects } from "./projects";

/**
 * Per-project trend cache: primary package, download signal, and heuristic scores, upserted daily by backend tasks.
 * Derived data for listings/search—not canonical project metadata.
 */
export const projectTrends = pgTable(
  "project_trends",
  {
    projectId: text("project_id")
      .primaryKey()
      .references(() => projects.id, { onDelete: "cascade" }),
    packageName: text("package_name"),
    monthlyDownloads: integer("monthly_downloads"),
    usageScore: real("usage_score").notNull(), // heuristic: NPM monthly downloads scale
    relevanceScore: real("relevance_score").notNull(), // heuristic: blend of popularity/activity/usage; listings use >= 0, search may not
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("project_trends_usage_score_idx").on(table.usageScore),
    index("project_trends_relevance_score_idx").on(table.relevanceScore),
  ],
);

export const projectTrendsRelations = relations(projectTrends, ({ one }) => ({
  project: one(projects, {
    fields: [projectTrends.projectId],
    references: [projects.id],
  }),
}));
