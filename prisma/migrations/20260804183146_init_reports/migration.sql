-- pgvector lives inside this Neon Postgres database; it is not a second DB.
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('screenshot', 'text', 'described_call');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('zalo', 'facebook', 'phone_call', 'email', 'website', 'other');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('deepfake_impersonation', 'timeshare_contract', 'fake_prize', 'investment_scam', 'misinformation', 'other');

-- CreateEnum
CREATE TYPE "Technique" AS ENUM ('urgency', 'fear', 'authority', 'scarcity', 'social_proof', 'secrecy', 'emotional_bait', 'decontextualization', 'fabricated_evidence', 'bandwagon', 'character_attack');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('watch', 'caution', 'warning');

-- CreateEnum
CREATE TYPE "ConfirmationSource" AS ENUM ('ai_detected', 'user_reported');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "Source" NOT NULL,
    "platform" "Platform" NOT NULL,
    "category" "Category" NOT NULL,
    "claims" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "techniques" "Technique"[] NOT NULL DEFAULT ARRAY[]::"Technique"[],
    "tier" "Tier" NOT NULL,
    "risk_score" INTEGER NOT NULL,
    "explanation_en" TEXT NOT NULL,
    "money_requested" BOOLEAN NOT NULL DEFAULT false,
    "amount_vnd" BIGINT,
    "location" TEXT,
    "is_seed" BOOLEAN NOT NULL DEFAULT false,
    "is_shared" BOOLEAN NOT NULL DEFAULT false,
    "confirmation_source" "ConfirmationSource",
    "submitted_by_clerk_id" TEXT,
    "source_citation" TEXT,
    "embedding" vector(1536),
    "agent_session_id" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "reports_risk_score_check" CHECK ("risk_score" BETWEEN 0 AND 100),
    CONSTRAINT "reports_amount_vnd_check" CHECK ("amount_vnd" IS NULL OR "amount_vnd" >= 0),
    CONSTRAINT "reports_shared_confirmation_check" CHECK (
      (NOT "is_shared" AND "confirmation_source" IS NULL)
      OR ("is_shared" AND "confirmation_source" IS NOT NULL)
    )
);

-- Unique Eve session key makes a retried durable save step idempotent.
CREATE UNIQUE INDEX "reports_agent_session_id_key" ON "reports"("agent_session_id");

-- Dashboard and gallery indexes.
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");
CREATE INDEX "reports_tier_idx" ON "reports"("tier");
CREATE INDEX "reports_is_shared_idx" ON "reports"("is_shared");
CREATE INDEX "reports_is_seed_idx" ON "reports"("is_seed");
CREATE INDEX "reports_submitted_by_clerk_id_idx" ON "reports"("submitted_by_clerk_id");
CREATE INDEX "reports_confirmed_cases_idx" ON "reports"("created_at")
  WHERE "is_seed" = true OR "is_shared" = true;
