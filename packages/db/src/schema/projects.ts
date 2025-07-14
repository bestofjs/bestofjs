import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { PROJECT_STATUSES } from "../constants";
import { packages } from "./packages";
import { repos } from "./repos";
import { tags } from "./tags";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  overrideDescription: boolean("override_description"),
  url: text("url"),
  overrideURL: boolean("override_url"),
  status: text("status", { enum: PROJECT_STATUSES }).notNull(),
  logo: text("logo"),
  twitter: text("twitter"),
  priority: smallint("priority").notNull().default(0),
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  repoId: text("repoId")
    .references(() => repos.id, { onDelete: "cascade" })
    .notNull(),
});

export const projectsToTags = pgTable(
  "projects_to_tags",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.tagId] })],
);

export const projectsRelations = relations(projects, ({ many, one }) => ({
  projectsToTags: many(projectsToTags),
  repo: one(repos, { fields: [projects.repoId], references: [repos.id] }),
  packages: many(packages),
}));

export const projectsToTagsRelations = relations(projectsToTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectsToTags.projectId],
    references: [projects.id],
  }),
  tag: one(tags, {
    fields: [projectsToTags.tagId],
    references: [tags.id],
  }),
}));
