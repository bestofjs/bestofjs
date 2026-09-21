CREATE TABLE "tag_closure" (
	"descendant_id" text NOT NULL,
	"ancestor_id" text NOT NULL,
	"depth" integer NOT NULL,
	CONSTRAINT "tag_closure_descendant_id_ancestor_id_pk" PRIMARY KEY("descendant_id","ancestor_id")
);
--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "facet" text;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "parent_tag_id" text;--> statement-breakpoint
ALTER TABLE "tag_closure" ADD CONSTRAINT "tag_closure_descendant_id_tags_id_fk" FOREIGN KEY ("descendant_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_closure" ADD CONSTRAINT "tag_closure_ancestor_id_tags_id_fk" FOREIGN KEY ("ancestor_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tag_closure_ancestor_idx" ON "tag_closure" USING btree ("ancestor_id");--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_parent_tag_id_tags_id_fk" FOREIGN KEY ("parent_tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;