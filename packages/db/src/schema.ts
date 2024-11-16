import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { PROJECT_STATUSES } from "./constants";

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

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  aliases: jsonb("aliases"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
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
  (t) => [primaryKey({ columns: [t.projectId, t.tagId] })]
);

export const projectsRelations = relations(projects, ({ many, one }) => ({
  projectsToTags: many(projectsToTags),
  repo: one(repos, { fields: [projects.repoId], references: [repos.id] }),
  packages: many(packages),
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

    // From GitHub GraphQL API
    last_commit: timestamp("last_commit"),
    commit_count: integer("commit_count"),

    // From scrapping
    contributor_count: integer("contributor_count"),
  },
  (table) => [uniqueIndex("name_owner_index").on(table.owner, table.name)]
);

export const reposRelations = relations(repos, ({ many, one }) => ({
  projects: many(projects),
  snapshots: many(snapshots),
  hallOfFameMember: one(hallOfFame, {
    fields: [repos.owner],
    references: [hallOfFame.username],
  }),
}));

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
  (table) => [primaryKey({ columns: [table.repoId, table.year] })]
);

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
  repo: one(repos, {
    fields: [snapshots.repoId],
    references: [repos.id],
  }),
}));

export const packages = pgTable("packages", {
  name: text("name").primaryKey(),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  version: text("version"),
  monthlyDownloads: integer("downloads"),
  dependencies: jsonb("dependencies"),
  devDependencies: jsonb("devDependencies"),
  deprecated: boolean("deprecated"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const packagesRelations = relations(packages, ({ one }) => ({
  project: one(projects, {
    fields: [packages.projectId],
    references: [projects.id],
  }),
  bundles: one(bundles, {
    fields: [packages.name],
    references: [bundles.name],
  }),
}));

export const bundles = pgTable("bundles", {
  name: text("name")
    .primaryKey()
    .references(() => packages.name, { onDelete: "cascade" }),
  version: text("version"),
  size: integer("size"),
  gzip: integer("gzip"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const bundlesRelations = relations(bundles, ({ one }) => ({
  packages: one(packages, {
    fields: [bundles.name],
    references: [packages.name],
  }),
}));

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
