-- Retain historical structured reports while removing the deprecated source.
CREATE TYPE "Source_new" AS ENUM ('screenshot', 'text');

ALTER TABLE "reports"
  ALTER COLUMN "source" TYPE "Source_new"
  USING (
    CASE
      WHEN "source"::text = 'described_call' THEN 'text'
      ELSE "source"::text
    END
  )::"Source_new";

DROP TYPE "Source";
ALTER TYPE "Source_new" RENAME TO "Source";
