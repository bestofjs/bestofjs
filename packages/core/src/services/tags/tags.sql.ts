import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { projectsToTags } from "../projects/projects.sql";
import type { TagFacet } from "./taxonomy.shared";

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  aliases: jsonb("aliases"),
  facet: text("facet").$type<TagFacet>(),
  parentTagId: text("parent_tag_id").references((): AnyPgColumn => tags.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const tagClosure = pgTable(
  "tag_closure",
  {
    descendantId: text("descendant_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    ancestorId: text("ancestor_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    depth: integer("depth").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.descendantId, table.ancestorId] }),
    index("tag_closure_ancestor_idx").on(table.ancestorId),
  ],
);

export const tagsRelations = relations(tags, ({ many, one }) => ({
  projectsToTags: many(projectsToTags),
  parent: one(tags, {
    fields: [tags.parentTagId],
    references: [tags.id],
    relationName: "tag_parent",
  }),
  children: many(tags, { relationName: "tag_parent" }),
}));
