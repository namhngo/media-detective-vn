-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "reports_is_demo_idx" ON "reports"("is_demo");
