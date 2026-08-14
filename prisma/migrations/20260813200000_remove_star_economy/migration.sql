-- The prototype star economy is intentionally retired. The reviewed MIL fact
-- library remains for the Signal Run mini game.
DROP TABLE IF EXISTS "star_events";
ALTER TABLE "users" DROP COLUMN IF EXISTS "star_balance";
DROP TYPE IF EXISTS "StarEventKind";
