DO $$ BEGIN
 ALTER TABLE "bundles" ADD CONSTRAINT "bundles_name_packages_name_fk" FOREIGN KEY ("name") REFERENCES "public"."packages"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
