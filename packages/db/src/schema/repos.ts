import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { hallOfFame } from "./hall-of-fame";
import { projects } from "./projects";
import { snapshots } from "./snapshots";

export const repos = pgTable(
  "repos",
  {
    id: text("id").primaryKey(),
    // Date of addition to Best of JS
    added_at: timestamp("added_at").notNull().defaultNow(),
    // Last update (by the daily task)
    updated_at: timestamp("updated_at"),
    // From GitHub REST API
    archived: boolean("archived"),
    default_branch: text("default_branch"),
    description: text("description"),
    homepage: text("homepage"),
    name: text("name").notNull(),
    owner: text("owner").notNull(),
    owner_id: integer("owner_id").notNull(), // used in GitHub users avatar URLs
    stars: integer("stargazers_count"),
    topics: jsonb("topics"),

    pushed_at: timestamp("pushed_at").notNull(),
    created_at: timestamp("created_at").notNull(),
    license: text("license"),

    // From GitHub GraphQL API
    last_commit: timestamp("last_commit"),
    commit_count: integer("commit_count"),

    // From scrapping
    contributor_count: integer("contributor_count"),
  },
  (table) => [uniqueIndex("name_owner_index").on(table.owner, table.name)],
);

export const reposRelations = relations(repos, ({ many, one }) => ({
  projects: many(projects),
  snapshots: many(snapshots),
  hallOfFameMember: one(hallOfFame, {
    fields: [repos.owner],
    references: [hallOfFame.username],
  }),
}));
