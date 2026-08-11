-- CreateEnum
CREATE TYPE "BadgeKind" AS ENUM ('first_check', 'watchful_10', 'watchful_50', 'first_report', 'guardian_5', 'streak_7', 'pattern_spotter');

-- AlterTable
ALTER TABLE "report_events" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "user_id" TEXT;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_checks" INTEGER NOT NULL DEFAULT 0,
    "total_reports" INTEGER NOT NULL DEFAULT 0,
    "public_contributions" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "categories_seen" INTEGER NOT NULL DEFAULT 0,
    "last_active_on" DATE,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "badge" "BadgeKind" NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE INDEX "user_badges_user_id_earned_at_idx" ON "user_badges"("user_id", "earned_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_user_id_badge_key" ON "user_badges"("user_id", "badge");

-- CreateIndex
CREATE INDEX "report_events_actor_clerk_id_created_at_idx" ON "report_events"("actor_clerk_id", "created_at");

-- CreateIndex
CREATE INDEX "report_events_user_id_created_at_idx" ON "report_events"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "reports_user_id_idx" ON "reports"("user_id");

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_events" ADD CONSTRAINT "report_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: every distinct Clerk id already present becomes a user row, then
-- existing reports and events are linked to it. Counters are left at 0 and are
-- rebuilt by recomputeUserStats() on the next write for that user.
INSERT INTO "users" ("id", "clerk_id", "created_at", "updated_at")
SELECT gen_random_uuid(), c."clerk_id", now(), now()
FROM (
  SELECT DISTINCT "submitted_by_clerk_id" AS "clerk_id"
  FROM "reports"
  WHERE "submitted_by_clerk_id" IS NOT NULL
  UNION
  SELECT DISTINCT "actor_clerk_id" AS "clerk_id"
  FROM "report_events"
  WHERE "actor_clerk_id" IS NOT NULL
) AS c
ON CONFLICT ("clerk_id") DO NOTHING;

UPDATE "reports" r
SET "user_id" = u."id"
FROM "users" u
WHERE r."submitted_by_clerk_id" = u."clerk_id"
  AND r."user_id" IS NULL;

UPDATE "report_events" e
SET "user_id" = u."id"
FROM "users" u
WHERE e."actor_clerk_id" = u."clerk_id"
  AND e."user_id" IS NULL;
