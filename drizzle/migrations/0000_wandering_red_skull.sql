CREATE TABLE IF NOT EXISTS "board" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"backgroundColor" text NOT NULL,
	"order" integer NOT NULL,
	"isCurrentBoard" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "free_tier_limit" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"boardsCount" integer DEFAULT 0 NOT NULL,
	"listsCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "free_tier_limit_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"order" integer NOT NULL,
	"color" text NOT NULL,
	"listId" text NOT NULL,
	"boardId" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "list" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"order" integer NOT NULL,
	"color" text NOT NULL,
	"boardId" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "premium_subscription" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"stripeCustomerId" text,
	"stripeSubscriptionId" text,
	"stripePriceId" text,
	"stripeCurrentPeriodEnd" timestamp,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "premium_subscription_userId_unique" UNIQUE("userId"),
	CONSTRAINT "premium_subscription_stripeCustomerId_unique" UNIQUE("stripeCustomerId"),
	CONSTRAINT "premium_subscription_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId"),
	CONSTRAINT "premium_subscription_stripePriceId_unique" UNIQUE("stripePriceId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_listId_list_id_fk" FOREIGN KEY ("listId") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "list" ADD CONSTRAINT "list_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_board" ON "board" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_free_tier_limit" ON "free_tier_limit" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "listId" ON "item" USING btree ("listId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "boardId" ON "list" USING btree ("boardId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_premium_subscription" ON "premium_subscription" USING btree ("userId");