CREATE TABLE "repo_trends" (
	"repo_id" text PRIMARY KEY NOT NULL,
	"stars" integer,
	"daily" integer,
	"weekly" integer,
	"monthly" integer,
	"quarterly" integer,
	"yearly" integer,
	"popularity_score" real NOT NULL,
	"activity_score" real NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "repo_trends" ADD CONSTRAINT "repo_trends_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "repo_trends_popularity_score_idx" ON "repo_trends" USING btree ("popularity_score");--> statement-breakpoint
CREATE INDEX "repo_trends_activity_score_idx" ON "repo_trends" USING btree ("activity_score");--> statement-breakpoint
CREATE INDEX "repo_trends_daily_idx" ON "repo_trends" USING btree ("daily");--> statement-breakpoint
CREATE INDEX "repo_trends_stars_idx" ON "repo_trends" USING btree ("stars");--> statement-breakpoint
CREATE VIEW "public"."repo_trends_view" AS (select "repo_trends"."repo_id", "repos"."owner" || '/' || "repos"."name" as "full_name", "repo_trends"."stars", "repo_trends"."daily", "repo_trends"."weekly", "repo_trends"."monthly", "repo_trends"."quarterly", "repo_trends"."yearly", "repo_trends"."popularity_score", "repo_trends"."activity_score", "repo_trends"."updated_at" from "repo_trends" inner join "repos" on "repo_trends"."repo_id" = "repos"."id");