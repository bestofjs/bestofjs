CREATE TABLE IF NOT EXISTS "hall_of_fame" (
	"username" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"followers" integer,
	"bio" text,
	"homepage" text,
	"twitter" text,
	"avatar" text,
	"npm_username" text,
	"npm_package_count" integer,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hall_of_fame_to_projects" (
	"username" text NOT NULL,
	"project_id" text NOT NULL,
	CONSTRAINT "hall_of_fame_to_projects_username_project_id_pk" PRIMARY KEY("username","project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hall_of_fame_to_projects" ADD CONSTRAINT "hall_of_fame_to_projects_username_hall_of_fame_username_fk" FOREIGN KEY ("username") REFERENCES "public"."hall_of_fame"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hall_of_fame_to_projects" ADD CONSTRAINT "hall_of_fame_to_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
