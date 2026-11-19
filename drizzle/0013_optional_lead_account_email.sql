ALTER TABLE "account_leads" ALTER COLUMN "account_email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lead_accounts" ALTER COLUMN "phone" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lead_accounts" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lead_accounts" ADD CONSTRAINT "lead_accounts_phone_unique" UNIQUE("phone");