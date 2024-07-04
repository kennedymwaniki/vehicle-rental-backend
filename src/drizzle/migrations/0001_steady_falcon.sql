ALTER TABLE "authentication" RENAME TO "auth_users";--> statement-breakpoint
ALTER TABLE "auth_users" DROP CONSTRAINT "authentication_user_id_users_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
