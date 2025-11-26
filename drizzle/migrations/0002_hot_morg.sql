ALTER TABLE "board" ADD COLUMN "checklistMode" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "list" DROP COLUMN "checklistMode";