/*
  Warnings:

  - You are about to drop the column `boardId` on the `BoardLimit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `BoardLimit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BoardLimit_boardId_idx";

-- DropIndex
DROP INDEX "BoardLimit_boardId_key";

-- AlterTable
ALTER TABLE "BoardLimit" DROP COLUMN "boardId";

-- CreateIndex
CREATE UNIQUE INDEX "BoardLimit_userId_key" ON "BoardLimit"("userId");

-- CreateIndex
CREATE INDEX "BoardLimit_userId_idx" ON "BoardLimit"("userId");
