CREATE TYPE "public"."billing_period" AS ENUM('week', 'month');--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"badge" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price_paise" integer NOT NULL,
	"compare_at_paise" integer,
	"billing_period" "billing_period" NOT NULL,
	"features" text[] DEFAULT '{}' NOT NULL,
	"highlighted" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
INSERT INTO "plans" ("id", "name", "badge", "description", "price_paise", "compare_at_paise", "billing_period", "features", "highlighted", "active", "sort_order") VALUES
	('starter', '7-Day Starter', 'Try it first', 'Run live campaigns for a week and see the leads for yourself.', 500000, NULL, 'week', ARRAY[
		'AI-written ad copy and creatives',
		'Targeting tuned to your local audience',
		'Daily optimisation for the lowest cost per lead',
		'Leads delivered to your WhatsApp instantly'
	], false, true, 1),
	('growth', 'Growth', 'Recommended', 'Fully managed lead generation with a dedicated ads specialist.', 2500000, NULL, 'month', ARRAY[
		'A dedicated ads specialist, backed by the AI',
		'Custom-designed creatives and offers',
		'Custom audiences and retargeting funnels',
		'A landing page built to convert',
		'Weekly optimisation and strategy calls',
		'Leads delivered to your WhatsApp instantly'
	], true, true, 2),
	('ai', 'AI Lead Generation', 'Recommended', 'AI runs your Meta ads — hands-free.', 239900, 299900, 'month', ARRAY[
		'AI writes copy & designs creatives',
		'Auto-targets your local audience',
		'Optimises daily for lowest cost per lead',
		'Leads to your WhatsApp instantly'
	], false, false, 90),
	('custom', 'Custom Lead Generation', 'Most leads', 'A dedicated expert plus the AI.', 799900, 999900, 'month', ARRAY[
		'Everything in AI, plus a human ads expert',
		'Hand-designed creatives & offers',
		'Custom audiences + retargeting funnels',
		'A landing page built to convert',
		'Weekly optimisation + strategy calls'
	], false, false, 91);
