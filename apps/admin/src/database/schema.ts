import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").unique(),
  slug: text("slug").unique(),
  description: text("description").notNull(),
  overrideDescription: boolean("override_description"),
  url: text("url"),
  overrideURL: boolean("override_url"),
  status: text("status", {
    enum: ["active", "featured", "promoted", "deprecated"],
  }),
  logo: text("logo"),
  twitter: text("twitter"),
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: date("updated_at"),
  repoId: text("repoId").references(() => repos.id),
});

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  code: text("code").unique(),
  name: text("name").notNull(),
  description: text("description"),
  aliases: jsonb("aliases"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});

export const projectsToTags = pgTable(
  "projects_to_tags",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey(t.projectId, t.tagId),
  })
);

export const projectsRelations = relations(projects, ({ many, one }) => ({
  projectsToTags: many(projectsToTags),
  repo: one(repos, { fields: [projects.repoId], references: [repos.id] }),
  snapshots: many(snapshots),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  projectsToTags: many(projectsToTags),
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

export const repos = pgTable("repos", {
  id: text("id").primaryKey(),
  // Date of addition to Best of JS
  added_at: date("added_at"),
  // Last update (by the daily task)
  updated_at: date("updated_at"),
  // From GitHub REST API
  archived: boolean("archived"),
  default_branch: text("default_branch"),
  description: text("description"),
  full_name: text("full_name").unique(),
  homepage: text("homepage"),
  name: text("name").notNull(),
  owner_id: text("owner_id").notNull(),
  stars: integer("stargazers_count"),
  topics: jsonb("topics"),

  pushed_at: date("pushed_at"),
  created_at: date("created_at"),

  // From GitHub GraphQL API
  last_commit: date("last_commit"),
  commit_count: integer("commit_count"),

  // From scrapping
  contributor_count: integer("contributor_count"),
});

export const reposRelations = relations(repos, ({ one, many }) => ({
  projects: one(projects, {
    fields: [repos.id],
    references: [projects.repoId],
  }),
  snapshots: many(snapshots),
}));

export const bookmarks = pgTable(
  "bookmarks",
  {
    userEmail: text("user_email").notNull(),
    projectSlug: text("project_slug")
      .notNull()
      .references(() => projects.slug),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userEmail, t.projectSlug),
  })
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  project: one(projects, {
    fields: [bookmarks.projectSlug],
    references: [projects.slug],
  }),
}));

export const snapshots = pgTable("snapshots", {
  repoId: text("repo_id")
    .notNull()
    .references(() => repos.id),
  createdAt: timestamp("created_at").notNull(),
  year: integer("year"),
  months: jsonb("months"),
});

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
  repo: one(repos, {
    fields: [snapshots.repoId],
    references: [repos.id],
  }),
}));
