import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { projects } from "./projects";
import { repos } from "./repos";

export const hallOfFame = pgTable("hall_of_fame", {
  username: text("username").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  followers: integer("followers"),
  bio: text("bio"),
  homepage: text("homepage"),
  twitter: text("twitter"),
  avatar: text("avatar"),
  npmUsername: text("npm_username"),
  npmPackageCount: integer("npm_package_count"),
  status: text("status", { enum: ["active", "inactive", "archived"] })
    .default("active")
    .notNull(),
});

export const hallOfFameToProjects = pgTable(
  "hall_of_fame_to_projects",
  {
    username: text("username")
      .notNull()
      .references(() => hallOfFame.username, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.username, t.projectId] })]
);

export const hallOfFameRelations = relations(hallOfFame, ({ many }) => ({
  hallOfFameToProjects: many(hallOfFameToProjects),
  repos: many(repos),
}));

export const hallOfFameToProjectsRelations = relations(
  hallOfFameToProjects,
  ({ one }) => ({
    project: one(projects, {
      fields: [hallOfFameToProjects.projectId],
      references: [projects.id],
    }),
    hallOfFame: one(hallOfFame, {
      fields: [hallOfFameToProjects.username],
      references: [hallOfFame.username],
    }),
  })
);
