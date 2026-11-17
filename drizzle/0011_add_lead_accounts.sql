CREATE TYPE "public"."account_lead_status" AS ENUM('valid', 'invalid', 'follow_up');--> statement-breakpoint
CREATE TABLE "account_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"account_email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"comment" text DEFAULT '' NOT NULL,
	"status" "account_lead_status" DEFAULT 'follow_up' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lead_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lead_accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "lead_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "account_leads" ADD CONSTRAINT "account_leads_account_id_lead_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."lead_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_leads_account_created_idx" ON "account_leads" USING btree ("account_id","created_at");