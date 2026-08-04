import { config } from "dotenv";

config({ path: ".env.local" });

import {
  Category,
  ConfirmationSource,
  Platform,
  ReportEventType,
  Source,
  Technique,
  Tier,
} from "@prisma/client";

import { getPrisma } from "../src/lib/db";
import { createEmbeddings, toVectorLiteral } from "../src/lib/embedding";
import { seedGallery } from "../src/lib/mock";
import { createStructuredSummary } from "../src/lib/structured-summary";

type CalibrationRow = {
  id: string;
  createdAt: string;
  source: "text" | "described_call" | "screenshot";
  platform: "zalo" | "facebook" | "phone_call" | "email" | "website" | "other";
  category:
    | "deepfake_impersonation"
    | "timeshare_contract"
    | "fake_prize"
    | "investment_scam"
    | "misinformation"
    | "other";
  claims: string[];
  techniques: Array<
    | "urgency"
    | "fear"
    | "authority"
    | "scarcity"
    | "social_proof"
    | "secrecy"
    | "emotional_bait"
    | "decontextualization"
    | "fabricated_evidence"
    | "bandwagon"
    | "character_attack"
  >;
  tier: "watch" | "caution" | "warning";
  riskScore: number;
  explanationEn: string;
  moneyRequested: boolean;
  amountVnd: number | null;
  location: string | null;
  sourceCitation: string;
  isSeed: false;
  isDemo: true;
};

// These are deliberately not researcher-sourced "confirmed cases". They are
// controlled calibration fixtures so partners can see all three tiers in the
// dashboard without mislabeling known police cases as low-risk.
const calibrationRows: CalibrationRow[] = [
  {
    id: "demo-watch-001",
    createdAt: "2026-08-01T10:00:00.000Z",
    source: "text",
    platform: "other",
    category: "other",
    claims: [
      "A supermarket announces a weekend discount on household goods",
      "The message links to the retailer's existing official website",
    ],
    techniques: [],
    tier: "watch",
    riskScore: 22,
    explanationEn:
      "Nothing here raises a clear manipulation flag: there is no request for money, code, private information, or secrecy. The useful habit still applies: open the retailer's known website yourself instead of following an unexpected link.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    sourceCitation: "Media Detective calibration fixture — not a public case",
    isSeed: false,
    isDemo: true,
  },
  {
    id: "demo-watch-002",
    createdAt: "2026-08-02T09:30:00.000Z",
    source: "text",
    platform: "website",
    category: "other",
    claims: [
      "A local library publishes its opening hours and a free community workshop date",
      "The information matches the institution's existing public website",
    ],
    techniques: [],
    tier: "watch",
    riskScore: 18,
    explanationEn:
      "This looks like routine public information and contains no obvious pressure tactic. It is still good practice to verify a changed schedule through the organisation's known website or phone number.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    sourceCitation: "Media Detective calibration fixture — not a public case",
    isSeed: false,
    isDemo: true,
  },
  {
    id: "demo-caution-001",
    createdAt: "2026-08-02T15:00:00.000Z",
    source: "text",
    platform: "facebook",
    category: "fake_prize",
    claims: [
      "An unfamiliar page says the reader has won a travel voucher",
      "The offer says the claim link expires today",
      "The page asks the reader to forward the post before collecting the prize",
    ],
    techniques: ["urgency", "scarcity", "social_proof"],
    tier: "caution",
    riskScore: 58,
    explanationEn:
      "This uses a familiar prize pattern: urgency, a limited-time claim, and a request to spread the post. There is not enough evidence here to call it a confirmed scam, but do not follow the link or share it until you can verify the organiser through an official channel.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    sourceCitation: "Media Detective calibration fixture — not a public case",
    isSeed: false,
    isDemo: true,
  },
  {
    id: "demo-caution-002",
    createdAt: "2026-08-03T11:00:00.000Z",
    source: "screenshot",
    platform: "zalo",
    category: "misinformation",
    claims: [
      "A widely forwarded post uses an old flooding image to imply a current emergency",
      "The post asks people to spread the warning before checking an official source",
    ],
    techniques: ["emotional_bait", "decontextualization", "bandwagon"],
    tier: "caution",
    riskScore: 62,
    explanationEn:
      "The image may be real, but its context is unclear. The emotional push to forward it quickly can spread a false warning even without malicious intent. Check an official local source and reverse-search the image before passing it on.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    sourceCitation: "Media Detective calibration fixture — not a public case",
    isSeed: false,
    isDemo: true,
  },
];

function assertSeedEnvironment() {
  const branch = process.env.DATABASE_BRANCH;
  const allowProduction = process.env.ALLOW_PRODUCTION_SEED === "true";

  if (branch === "staging") return;
  if (branch === "production" && allowProduction) return;

  if (branch === "production") {
    throw new Error(
      "Refusing to seed production: set ALLOW_PRODUCTION_SEED=true explicitly for this one command.",
    );
  }

  throw new Error(
    "Refusing to seed: set DATABASE_BRANCH=staging, or use production with ALLOW_PRODUCTION_SEED=true.",
  );
}

function isCalibrationRow(
  row: (typeof seedGallery)[number] | CalibrationRow,
): row is CalibrationRow {
  return "isDemo" in row && row.isDemo;
}

function riskScoreFor(row: (typeof seedGallery)[number] | CalibrationRow) {
  return isCalibrationRow(row) ? row.riskScore : row.tier === "warning" ? 80 : 20;
}

async function main() {
  assertSeedEnvironment();

  const prisma = getPrisma();
  const rows = [...seedGallery, ...calibrationRows];
  const summaries = rows.map((seed) =>
    createStructuredSummary({
      category: seed.category,
      platform: seed.platform,
      claims: seed.claims,
      techniques: seed.techniques,
      explanationEn: seed.explanationEn,
    }),
  );
  const embeddings = await createEmbeddings(summaries);

  for (const [index, seed] of rows.entries()) {
    const data = {
      createdAt: new Date(seed.createdAt),
      source: seed.source as Source,
      platform: seed.platform as Platform,
      category: seed.category as Category,
      claims: seed.claims,
      techniques: seed.techniques as Technique[],
      tier: seed.tier as Tier,
      riskScore: riskScoreFor(seed),
      explanationEn: seed.explanationEn,
      moneyRequested: seed.moneyRequested,
      amountVnd: seed.amountVnd === null ? null : BigInt(seed.amountVnd),
      location: seed.location,
      isSeed: seed.isSeed,
      isDemo: isCalibrationRow(seed),
      isShared: false,
      confirmationSource: null as ConfirmationSource | null,
      submittedByClerkId: null,
      sourceCitation: seed.sourceCitation,
      agentSessionId: null,
    };

    await prisma.report.upsert({
      where: { id: seed.id },
      create: { id: seed.id, ...data },
      update: data,
    });

    await prisma.$executeRaw`
      UPDATE "reports"
      SET "embedding" = ${toVectorLiteral(embeddings[index])}::vector
      WHERE "id" = ${seed.id}
    `;

    await prisma.reportEvent.upsert({
      where: {
        reportId_type: {
          reportId: seed.id,
          type: ReportEventType.seeded,
        },
      },
      create: {
        reportId: seed.id,
        type: ReportEventType.seeded,
      },
      update: {},
    });
  }

  console.log(
    `Seeded ${seedGallery.length} research cases and ${calibrationRows.length} calibration rows into ${process.env.DATABASE_BRANCH}.`,
  );
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
