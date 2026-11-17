ALTER TABLE "account_leads" ADD COLUMN "account_name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "lead_accounts" ADD COLUMN "name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "lead_accounts" ADD COLUMN "phone" text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE "account_leads" l SET "account_name" = a."name" FROM "lead_accounts" a WHERE a."id" = l."account_id";
