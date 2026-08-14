CREATE TABLE "light_reveals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "fact_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "light_reveals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "light_reveals_user_id_fact_id_key"
ON "light_reveals"("user_id", "fact_id");

CREATE INDEX "light_reveals_user_id_created_at_idx"
ON "light_reveals"("user_id", "created_at");

ALTER TABLE "light_reveals"
ADD CONSTRAINT "light_reveals_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "light_reveals"
ADD CONSTRAINT "light_reveals_fact_id_fkey"
FOREIGN KEY ("fact_id") REFERENCES "mil_facts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
