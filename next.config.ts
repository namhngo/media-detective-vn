import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  // Defender has optional native ML imports that are not used by our Tier 1 policy.
  serverExternalPackages: ["@stackone/defender"],
};

// Mounts the Eve runtime on the same Next.js origin under /eve/v1/*.
// Local dev runs the agent beside Next; Vercel deploys both in one project.
export default withEve(nextConfig);
