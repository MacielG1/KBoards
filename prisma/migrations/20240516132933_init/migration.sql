-- CreateTable
CREATE TABLE "BoardLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardLimit_boardId_key" ON "BoardLimit"("boardId");

-- CreateIndex
CREATE INDEX "BoardLimit_boardId_idx" ON "BoardLimit"("boardId");
