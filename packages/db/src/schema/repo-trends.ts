import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { repos } from "./repos";

export const repoTrends = pgTable(
  "repo_trends",
  {
    repoId: text("repo_id")
      .primaryKey()
      .references(() => repos.id, { onDelete: "cascade" }),
    stars: integer("stars"),
    daily: integer("daily"),
    weekly: integer("weekly"),
    monthly: integer("monthly"),
    quarterly: integer("quarterly"),
    yearly: integer("yearly"),
    popularityScore: real("popularity_score").notNull(),
    activityScore: real("activity_score").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("repo_trends_popularity_score_idx").on(table.popularityScore),
    index("repo_trends_activity_score_idx").on(table.activityScore),
    index("repo_trends_daily_idx").on(table.daily),
    index("repo_trends_stars_idx").on(table.stars),
  ],
);

export const repoTrendsRelations = relations(repoTrends, ({ one }) => ({
  repo: one(repos, {
    fields: [repoTrends.repoId],
    references: [repos.id],
  }),
}));
