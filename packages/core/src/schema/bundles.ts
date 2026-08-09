import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { packages } from "./packages";

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
