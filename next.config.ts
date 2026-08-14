import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  // Defender has optional native ML imports that are not used by our Tier 1 policy.
  // Prisma Client must stay external: bundling it snapshots the generated
  // delegates, so `prisma generate` after a schema change leaves the bundled
  // copy stale and new models (e.g. LightReveal) read as undefined at runtime.
  serverExternalPackages: ["@stackone/defender", "@prisma/client", ".prisma/client"],
};

// Mounts the Eve runtime on the same Next.js origin under /eve/v1/*.
// Local dev runs the agent beside Next; Vercel deploys both in one project.
export default withEve(nextConfig);
