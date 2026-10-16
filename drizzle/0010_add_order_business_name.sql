ALTER TABLE "orders" ADD COLUMN "business_name" text;--> statement-breakpoint
UPDATE "orders" o SET "business_name" = b."name" FROM "businesses" b WHERE b."user_id" = o."user_id";
