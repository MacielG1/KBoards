CREATE TABLE "proxies" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "checked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "checklistMode" boolean DEFAULT false;