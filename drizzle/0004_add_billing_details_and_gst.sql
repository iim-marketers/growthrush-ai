ALTER TABLE "businesses" ADD COLUMN "billing_name" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "billing_gstin" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "billing_line1" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "billing_line2" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "billing_city" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "billing_state_code" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "billing_pincode" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tax_paise" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "place_of_supply" text;