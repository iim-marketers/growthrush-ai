ALTER TABLE "orders" ADD COLUMN "user_phone" text;--> statement-breakpoint
UPDATE "orders" o SET "user_phone" = u."phone" FROM "users" u WHERE u."id" = o."user_id";
