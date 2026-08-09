import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { bundles } from "./bundles";
import { projects } from "./projects";

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
