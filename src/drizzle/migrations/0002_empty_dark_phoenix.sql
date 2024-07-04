ALTER TABLE "auth_users" ADD COLUMN "email" varchar;--> statement-breakpoint
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_email_unique" UNIQUE("email");