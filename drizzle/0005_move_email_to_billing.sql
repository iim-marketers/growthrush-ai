ALTER TABLE "businesses" ADD COLUMN "billing_email" text;--> statement-breakpoint
UPDATE "businesses" SET "billing_email" = "users"."email" FROM "users" WHERE "users"."id" = "businesses"."user_id" AND "businesses"."billing_email" IS NULL;--> statement-breakpoint
ALTER TABLE "otp_challenges" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";
