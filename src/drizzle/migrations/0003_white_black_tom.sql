ALTER TABLE "country_group" ADD CONSTRAINT "country_group_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "country" ADD CONSTRAINT "country_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "country" ADD CONSTRAINT "country_code_unique" UNIQUE("code");