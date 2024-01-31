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
  description: text("description"),
  overrideDescription: boolean("override_description"),
  url: text("url"),
  overrideURL: boolean("override_url"),
  status: text("status", {
    enum: ["active", "featured", "promoted", "deprecated"],
  }),
  logo: text("logo"),
  twitter: text("twitter"),
  comments: text("comments"),
  createdAt: date("created_at"),
  updatedAt: date("updated_at"),
  repoId: text("repoId").references(() => repos.id),
});

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  code: text("code").unique(),
  name: text("name"),
  description: text("description"),
  aliases: text("aliases"),
  createdAt: date("createdAt"),
  updatedAt: date("updatedAt"),
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
  owner_id: text("owner_id"),
  name: text("name"),
  full_name: text("full_name").unique(),
  description: text("description"),
  homepage: text("homepage"),
  stars: integer("stargazers_count"),

  archived: boolean("archived"),

  pushed_at: date("pushed_at"),
  created_at: date("created_at"),
  updatedAt: date("updated_at"),

  commit_count: integer("commit_count"),
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
    createdAt: timestamp("created_at"),
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
  createdAt: timestamp("created_at"),
  year: integer("year"),
  months: jsonb("months"),
});

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
  repo: one(repos, {
    fields: [snapshots.repoId],
    references: [repos.id],
  }),
}));
