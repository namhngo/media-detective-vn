-- CreateEnum
CREATE TYPE "ReportEventType" AS ENUM ('analysis_created', 'shared', 'user_reported', 'seeded');

-- CreateTable
CREATE TABLE "report_events" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "type" "ReportEventType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_clerk_id" TEXT,

    CONSTRAINT "report_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_events_report_id_created_at_idx" ON "report_events"("report_id", "created_at");

-- CreateIndex
CREATE INDEX "report_events_type_created_at_idx" ON "report_events"("type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "report_events_report_id_type_key" ON "report_events"("report_id", "type");

-- AddForeignKey
ALTER TABLE "report_events" ADD CONSTRAINT "report_events_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
