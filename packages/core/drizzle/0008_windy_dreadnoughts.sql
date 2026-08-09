CREATE TABLE "daily_featured_projects" (
	"day" date PRIMARY KEY NOT NULL,
	"project_slugs" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
