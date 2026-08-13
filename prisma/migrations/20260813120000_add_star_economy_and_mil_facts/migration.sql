-- CreateEnum
CREATE TYPE "StarEventKind" AS ENUM ('spent_play');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "star_balance" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "star_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" "StarEventKind" NOT NULL DEFAULT 'spent_play',
    "delta" INTEGER NOT NULL,
    "fact_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "star_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mil_facts" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mil_facts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "star_events_user_id_created_at_idx" ON "star_events"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "mil_facts_category_reviewed_idx" ON "mil_facts"("category", "reviewed");

-- AddForeignKey
ALTER TABLE "star_events" ADD CONSTRAINT "star_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star_events" ADD CONSTRAINT "star_events_fact_id_fkey" FOREIGN KEY ("fact_id") REFERENCES "mil_facts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

