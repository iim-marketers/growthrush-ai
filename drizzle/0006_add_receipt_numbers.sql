CREATE TABLE "receipt_counters" (
	"financial_year" text PRIMARY KEY NOT NULL,
	"last_number" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "receipt_counters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_receipt_unique" UNIQUE("receipt");