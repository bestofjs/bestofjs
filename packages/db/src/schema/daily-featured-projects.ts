import { date as pgDate, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const dailyFeaturedProjects = pgTable("daily_featured_projects", {
  day: pgDate("day").primaryKey(),
  projectSlugs: text("project_slugs").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});
