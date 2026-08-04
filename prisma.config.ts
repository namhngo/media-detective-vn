// Mirrors the Prisma 7 setup used in Discovery Pipeline.
// Neon credentials are added later; generation works without a live database.
import "dotenv/config";
import { defineConfig } from "prisma/config";

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
