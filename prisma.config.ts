// Mirrors the Prisma 7 setup used in Discovery Pipeline, with Next.js local
// environment support. Prisma only auto-loads .env, while this app keeps
// secrets in .env.local.
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations should prefer Neon's direct URL. Runtime uses DATABASE_URL.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
