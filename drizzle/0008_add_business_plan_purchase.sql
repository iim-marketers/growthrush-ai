ALTER TABLE "businesses" ADD COLUMN "user_phone" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "purchased_plan_id" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "purchased_plan_name" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "purchased_amount_paise" integer;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "plan_purchased_at" timestamp with time zone;--> statement-breakpoint
UPDATE "businesses" b SET "user_phone" = u."phone" FROM "users" u WHERE u."id" = b."user_id";--> statement-breakpoint
UPDATE "businesses" b SET
	"purchased_plan_id" = o."plan_id",
	"purchased_plan_name" = COALESCE(p."name", o."plan_id"),
	"purchased_amount_paise" = o."amount_paise",
	"plan_purchased_at" = o."paid_at"
FROM (
	SELECT DISTINCT ON ("user_id") "user_id", "plan_id", "amount_paise", "paid_at"
	FROM "orders"
	WHERE "status" = 'paid' AND "paid_at" IS NOT NULL AND "user_id" IS NOT NULL
	ORDER BY "user_id", "paid_at" DESC
) o
LEFT JOIN "plans" p ON p."id" = o."plan_id"
WHERE b."user_id" = o."user_id";
