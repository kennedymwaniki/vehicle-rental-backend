ALTER TYPE "role" ADD VALUE 'both';--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "role" "role" DEFAULT 'user';