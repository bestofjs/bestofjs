import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { repos } from "./repos";

export const snapshots = pgTable(
  "snapshots",
  {
    repoId: text("repo_id")
      .notNull()
      .references(() => repos.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    year: integer("year").notNull(),
    months: jsonb("months"),
  },
  (table) => [primaryKey({ columns: [table.repoId, table.year] })],
);

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
  repo: one(repos, {
    fields: [snapshots.repoId],
    references: [repos.id],
  }),
}));
