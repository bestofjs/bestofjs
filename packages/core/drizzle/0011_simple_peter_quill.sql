CREATE TABLE "project_trends" (
	"project_id" text PRIMARY KEY NOT NULL,
	"package_name" text,
	"monthly_downloads" integer,
	"usage_score" real NOT NULL,
	"relevance_score" real NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_trends" ADD CONSTRAINT "project_trends_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_trends_usage_score_idx" ON "project_trends" USING btree ("usage_score");--> statement-breakpoint
CREATE INDEX "project_trends_relevance_score_idx" ON "project_trends" USING btree ("relevance_score");--> statement-breakpoint
CREATE VIEW "public"."project_trends_view" AS (select "project_trends"."project_id", "projects"."slug", "projects"."name", "projects"."status", "repos"."owner" || '/' || "repos"."name" as "full_name", "project_trends"."package_name", "project_trends"."monthly_downloads", "project_trends"."usage_score", "project_trends"."relevance_score", "project_trends"."updated_at" from "project_trends" inner join "projects" on "project_trends"."project_id" = "projects"."id" inner join "repos" on "projects"."repoId" = "repos"."id");