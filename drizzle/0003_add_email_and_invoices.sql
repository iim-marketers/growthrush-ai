ALTER TABLE "orders" ADD COLUMN "razorpay_invoice_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "invoice_url" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "invoice_emailed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "otp_challenges" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_razorpay_invoice_id_unique" UNIQUE("razorpay_invoice_id");