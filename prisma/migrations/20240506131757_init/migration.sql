/*
  Warnings:

  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "isCurrentBoard" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "UserSettings";
