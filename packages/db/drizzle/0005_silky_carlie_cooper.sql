ALTER TABLE "repos" RENAME COLUMN "full_name" TO "owner";--> statement-breakpoint
ALTER TABLE "repos" DROP CONSTRAINT "repos_full_name_unique";--> statement-breakpoint
ALTER TABLE "repos" ALTER COLUMN "owner_id" SET DATA TYPE integer USING owner_id::integer;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_owner_index" ON "repos" USING btree ("owner","name");

UPDATE repos SET owner = split_part(owner, '/', 1);
