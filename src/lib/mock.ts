import type {
  AnalysisResult,
  DashboardResponse,
  DetectResponse,
  GalleryEntry,
  SimilarCase,
} from "@/lib/schema";

/**
 * Mock data shaped from the 7 researcher-sourced seed cases in the project
 * brief. The frontend runs entirely on this until the real backend lands —
 * API stubs must stay contract-valid (routes schema-parse before returning).
 */

/* ------------------------------ Seed gallery ----------------------------- */

export const seedGallery: GalleryEntry[] = [
  {
    id: "seed-001",
    createdAt: "2026-01-20T09:00:00.000Z",
    source: "text",
    platform: "phone_call",
    category: "deepfake_impersonation",
    claims: [
      "Scammers collect photos and audio from a victim's social media",
      "An AI face-and-voice clone is generated from the scraped material",
      "A live video call impersonates the relative and requests urgent money",
    ],
    techniques: ["urgency", "authority", "secrecy"],
    tier: "warning",
    explanationEn:
      "A live video call that looks and sounds like a family member can now be faked from a few scraped photos and seconds of audio. The call creates pressure to send money immediately and discourages checking with anyone else. Always hang up and call the person back on their usual number before acting.",
    moneyRequested: true,
    amountVnd: null,
    location: "Vĩnh Long",
    isSeed: true,
    confirmationSource: null,
    sourceCitation: "Vĩnh Long police public warning, 2026",
  },
  {
    id: "seed-002",
    createdAt: "2026-02-03T09:00:00.000Z",
    source: "text",
    platform: "other",
    category: "deepfake_impersonation",
    claims: [
      "A convincing deepfake video call can reportedly be produced in under a minute",
      "Consumer-grade tools are sufficient — no specialist equipment needed",
    ],
    techniques: [],
    tier: "warning",
    explanationEn:
      "The barrier to faking a person's face and voice on a live call has collapsed: consumer tools can reportedly produce a convincing result in under a minute. Seeing a familiar face on a video call is no longer proof of identity on its own.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    isSeed: true,
    confirmationSource: null,
    sourceCitation:
      "Vietnam Ministry of Information and Communications consumer-safety advisory, 2026",
  },
  {
    id: "seed-003",
    createdAt: "2026-03-11T09:00:00.000Z",
    source: "screenshot",
    platform: "facebook",
    category: "deepfake_impersonation",
    claims: [
      "Deepfaked videos of public figures appear in ads for herbal remedies and supplements",
      "The same technique promotes get-rich-quick courses and investment schemes",
      "The fake only needs to be convincing for a few seconds to work",
    ],
    techniques: ["authority", "urgency"],
    tier: "warning",
    explanationEn:
      "Ads are circulating that use deepfaked videos of well-known public figures to endorse remedies, supplements, and investment schemes. The clip does not need to be perfect — it only needs to borrow a few seconds of trust. A famous face in an ad is never evidence; check the person's official channels instead.",
    moneyRequested: true,
    amountVnd: null,
    location: null,
    isSeed: true,
    confirmationSource: null,
    sourceCitation: "Vietnamese news reporting, 2026",
  },
  {
    id: "seed-004",
    createdAt: "2026-04-08T09:00:00.000Z",
    source: "text",
    platform: "phone_call",
    category: "timeshare_contract",
    claims: [
      "21 criminal cases opened and 187 defendants charged over holiday-club contract fraud",
      "493 confirmed victims with roughly 181 billion VND stolen in one investigation",
      "One victim signed 71 separate contracts and lost close to 4 billion VND",
    ],
    techniques: ["urgency", "scarcity", "social_proof"],
    tier: "warning",
    explanationEn:
      "Hanoi's Economic Police broke up a holiday-club (timeshare) fraud ring: 493 confirmed victims and roughly 181 billion VND stolen in a single investigation, with one victim pressured into signing 71 contracts. Victims are rushed into signing and paying the same day — any contract that cannot wait 24 hours should not be signed.",
    moneyRequested: true,
    amountVnd: 181_000_000_000,
    location: "Hanoi",
    isSeed: true,
    confirmationSource: null,
    sourceCitation: "Hanoi Economic Police, 2026",
  },
  {
    id: "seed-005",
    createdAt: "2026-05-19T09:00:00.000Z",
    source: "described_call",
    platform: "phone_call",
    category: "timeshare_contract",
    claims: [
      "A call announces a prize or free vacation and invites the victim to a hotel event",
      "The seminar applies high-pressure sales tactics to force same-day signing",
      "Fabricated resale success stories are later used to block refund attempts",
    ],
    techniques: ["scarcity", "urgency", "social_proof"],
    tier: "warning",
    explanationEn:
      "The timeshare playbook is consistent: a prize or free-vacation call, an invitation to a polished hotel seminar, then manufactured urgency and planted success stories until the victim signs and pays on the spot. If you win a prize that requires attending a sales presentation, the prize is the bait.",
    moneyRequested: true,
    amountVnd: null,
    location: null,
    isSeed: true,
    confirmationSource: null,
    sourceCitation:
      "Vietnam Ministry of Public Security and provincial police advisories, 2026",
  },
  {
    id: "seed-006",
    createdAt: "2026-01-12T09:00:00.000Z",
    source: "text",
    platform: "other",
    category: "other",
    claims: [
      "106 defendants in a single mass-fraud case",
      "Roughly 200 billion VND stolen from over 4,000 victims",
      "Many of the victims were elderly",
    ],
    techniques: [],
    tier: "warning",
    explanationEn:
      "A single fraud case broken up in Tuyên Quang province in January 2026 involved 106 defendants, roughly 200 billion VND stolen, and more than 4,000 victims — many of them elderly people living away from their families. Isolation is the vulnerability these schemes exploit most.",
    moneyRequested: true,
    amountVnd: 200_000_000_000,
    location: "Tuyên Quang",
    isSeed: true,
    confirmationSource: null,
    sourceCitation: "Local police, January 2026",
  },
  {
    id: "seed-007",
    createdAt: "2025-12-15T09:00:00.000Z",
    source: "text",
    platform: "other",
    category: "other",
    claims: [
      "Over 6,000 billion VND (~USD 230M+) lost to online fraud in the first 11 months of 2025",
      "88% of surveyed users report unsolicited scam-adjacent contact",
    ],
    techniques: [],
    tier: "warning",
    explanationEn:
      "Online fraud in Vietnam is a national-scale problem, not a niche one: more than 6,000 billion VND was reported lost in just the first 11 months of 2025, and nearly nine in ten surveyed users say they have been contacted by something scam-adjacent. Nobody should feel embarrassed for checking — checking is the norm.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    isSeed: true,
    confirmationSource: null,
    sourceCitation:
      "Vietnam Ministry of Public Security / National Cyber Security Association",
  },
  {
    id: "seed-008",
    createdAt: "2026-07-28T09:00:00.000Z",
    source: "text",
    platform: "facebook",
    category: "misinformation",
    claims: [
      "A student was publicly accused of cheating, with a photo circulated as alleged proof",
      "The accusation went viral before any school or official statement",
      "The accusation was later found to be baseless",
    ],
    techniques: [
      "fabricated_evidence",
      "emotional_bait",
      "bandwagon",
      "character_attack",
    ],
    tier: "warning",
    explanationEn:
      "A false accusation against a student spread faster than any verification could. By the time the claim collapsed, the harm was irreversible — a reminder that viral reach is not evidence, and that sharing an unverified accusation makes you part of the pile-on. Verify first; when a private individual is targeted, not sharing is the default.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    isSeed: true,
    confirmationSource: null,
    sourceCitation:
      "Vietnamese news reporting on viral false accusations, 2026",
  },
  {
    id: "seed-009",
    createdAt: "2026-06-30T09:00:00.000Z",
    source: "screenshot",
    platform: "zalo",
    category: "misinformation",
    claims: [
      "A screenshot claims to show an official announcement of a new policy",
      "Formatting and wording do not match any government channel",
      "No matching announcement exists on the official portal",
    ],
    techniques: ["fabricated_evidence", "authority", "emotional_bait"],
    tier: "warning",
    explanationEn:
      "Fabricated screenshots of 'official announcements' are a staple of Vietnamese misinformation: they borrow authority, trigger outrage or fear, and spread through family group chats. The check is always the same — find the announcement on the official portal. If it isn't there, the screenshot is the story, not the policy.",
    moneyRequested: false,
    amountVnd: null,
    location: null,
    isSeed: true,
    confirmationSource: null,
    sourceCitation: "Vietnamese news reporting, 2026",
  },
];

/* ------------------------- Canned analyses (detect) ---------------------- */

const deepfakeAnalysis: AnalysisResult = {
  claims: [
    "Caller claims to be a close relative on a video call",
    "Requests an urgent money transfer for an emergency",
    "Asks the victim not to tell other family members",
  ],
  techniques: ["urgency", "secrecy", "authority"],
  category: "deepfake_impersonation",
  platform: "phone_call",
  tier: "warning",
  riskScore: 88,
  explanationEn:
    "This matches the deepfake impersonation playbook now widespread in Vietnam: a familiar face and voice on a video call, an emergency that needs money immediately, and a request to keep it secret. Face and voice are no longer proof of identity — a convincing fake can reportedly be made in under a minute. Hang up and call your relative back on their usual number before doing anything. Never transfer money under time pressure, and never keep the request secret from family.",
  moneyRequested: true,
  amountVnd: null,
};

const timeshareAnalysis: AnalysisResult = {
  claims: [
    "Caller announces a prize or free vacation",
    "Invitation to a hotel presentation to claim it",
    "Offer is framed as available today only",
  ],
  techniques: ["scarcity", "urgency", "social_proof"],
  category: "timeshare_contract",
  platform: "phone_call",
  tier: "warning",
  riskScore: 81,
  explanationEn:
    "This follows the timeshare (hợp đồng kỳ nghỉ) funnel that Vietnamese police have warned about: a prize call, a polished hotel seminar, then pressure to sign and pay on the same day. Hanoi's Economic Police alone charged 187 people over this scheme, with 493 confirmed victims. A prize that requires attending a sales presentation is bait, and any contract that cannot wait 24 hours should not be signed.",
  moneyRequested: true,
  amountVnd: null,
};

const benignAnalysis: AnalysisResult = {
  claims: ["Promotional message for a supermarket weekend discount"],
  techniques: [],
  category: "other",
  platform: "other",
  tier: "watch",
  riskScore: 22,
  explanationEn:
    "Nothing here raises a clear flag yet: no time pressure, no request for money or personal details, no borrowed authority. That said, 'no flag' is not a guarantee — if any message ever asks you to transfer money, share a code, or keep a secret from family, verify it through a channel you already trust before acting.",
  moneyRequested: false,
  amountVnd: null,
};

const misinformationAnalysis: AnalysisResult = {
  claims: [
    "Post accuses a named student of cheating, with a photo offered as proof",
    "Urges readers to share widely before any official statement",
    "Comment sections are already targeting the accused person",
  ],
  techniques: [
    "fabricated_evidence",
    "emotional_bait",
    "bandwagon",
    "character_attack",
  ],
  category: "misinformation",
  platform: "facebook",
  tier: "warning",
  riskScore: 79,
  explanationEn:
    "This asks you to judge and share before any verification: a private individual is named and shamed, the 'proof' is a photo that proves nothing by itself, and the push to share now is the engine of the harm. This year in Vietnam, a false accusation exactly like this went viral and the consequences were irreversible. Before sharing: check whether any credible outlet or official statement confirms it, look for the original source of the photo, and remember that virality is not evidence. When a private person is targeted, not sharing is the default.",
  moneyRequested: false,
  amountVnd: null,
};

const deepfakeSimilar: SimilarCase[] = [
  {
    id: "seed-001",
    category: "deepfake_impersonation",
    techniques: ["urgency", "authority", "secrecy"],
    tier: "warning",
    explanationEn:
      "AI face-and-voice clone used in a live video call to impersonate a relative and request urgent money.",
    similarity: 0.91,
    confirmationSource: null,
    sourceCitation: "Vĩnh Long police public warning, 2026",
  },
  {
    id: "seed-002",
    category: "deepfake_impersonation",
    techniques: [],
    tier: "warning",
    explanationEn:
      "A convincing deepfake video call can reportedly be produced in under a minute.",
    similarity: 0.83,
    confirmationSource: null,
    sourceCitation:
      "Vietnam Ministry of Information and Communications consumer-safety advisory, 2026",
  },
];

const timeshareSimilar: SimilarCase[] = [
  {
    id: "seed-005",
    category: "timeshare_contract",
    techniques: ["scarcity", "urgency", "social_proof"],
    tier: "warning",
    explanationEn:
      "Prize/free-vacation call leading to a high-pressure hotel seminar and same-day contract signing.",
    similarity: 0.89,
    confirmationSource: null,
    sourceCitation:
      "Vietnam Ministry of Public Security and provincial police advisories, 2026",
  },
  {
    id: "seed-004",
    category: "timeshare_contract",
    techniques: ["urgency", "scarcity", "social_proof"],
    tier: "warning",
    explanationEn:
      "Hanoi holiday-club fraud ring: 187 defendants charged, 493 confirmed victims, ~181 billion VND stolen.",
    similarity: 0.84,
    confirmationSource: null,
    sourceCitation: "Hanoi Economic Police, 2026",
  },
];

const misinformationSimilar: SimilarCase[] = [
  {
    id: "seed-008",
    category: "misinformation",
    techniques: [
      "fabricated_evidence",
      "emotional_bait",
      "bandwagon",
      "character_attack",
    ],
    tier: "warning",
    explanationEn:
      "A false accusation against a student went viral before verification; the claim later collapsed, but the harm was irreversible.",
    similarity: 0.9,
    confirmationSource: null,
    sourceCitation:
      "Vietnamese news reporting on viral false accusations, 2026",
  },
  {
    id: "seed-009",
    category: "misinformation",
    techniques: ["fabricated_evidence", "authority", "emotional_bait"],
    tier: "warning",
    explanationEn:
      "Fabricated screenshot of an 'official announcement' circulating in family group chats.",
    similarity: 0.81,
    confirmationSource: null,
    sourceCitation: "Vietnamese news reporting, 2026",
  },
];

/** Keyword router so different demo inputs produce meaningfully different results. */
export function mockDetectResponse(input: string): DetectResponse {
  const t = input.toLowerCase();
  const isMisinformation =
    /cheat|viral|hoax|rumou?r|fake news|accused|shaming|pile.?on|forwarded|everyone is posting|share this/.test(
      t,
    );
  const isDeepfake =
    /video call|voice|face|relative|nephew|uncle|aunt|son|daughter|mom|dad|mother|father|family/.test(
      t,
    );
  const isTimeshare =
    /vacation|seminar|prize|timeshare|voucher|hotel|free trip|holiday/.test(t);

  if (isMisinformation) {
    return {
      reportId: `mock-${Date.now()}`,
      analysis: misinformationAnalysis,
      similarCases: misinformationSimilar,
      sharePrompted: true,
    };
  }
  if (isDeepfake) {
    return {
      reportId: `mock-${Date.now()}`,
      analysis: deepfakeAnalysis,
      similarCases: deepfakeSimilar,
      sharePrompted: true,
    };
  }
  if (isTimeshare) {
    return {
      reportId: `mock-${Date.now()}`,
      analysis: timeshareAnalysis,
      similarCases: timeshareSimilar,
      sharePrompted: true,
    };
  }
  return {
    reportId: `mock-${Date.now()}`,
    analysis: benignAnalysis,
    similarCases: [], // similarity floor: nothing cleared it — correct and honest
    sharePrompted: false,
  };
}

/* ------------------------------ Dashboard -------------------------------- */

export const mockDashboard: DashboardResponse = {
  stats: {
    totalChecks: 147,
    confirmedCases: 21,
    topCategoryThisWeek: "deepfake_impersonation",
  },
  trend: [
    { date: "2025-12-15", watch: 0, caution: 0, warning: 1 },
    { date: "2026-01-12", watch: 0, caution: 1, warning: 2 },
    { date: "2026-01-20", watch: 1, caution: 0, warning: 2 },
    { date: "2026-02-03", watch: 0, caution: 1, warning: 1 },
    { date: "2026-03-11", watch: 1, caution: 1, warning: 1 },
    { date: "2026-04-08", watch: 0, caution: 2, warning: 2 },
    { date: "2026-05-19", watch: 1, caution: 1, warning: 2 },
    { date: "2026-06-24", watch: 2, caution: 3, warning: 2 },
    { date: "2026-07-08", watch: 3, caution: 4, warning: 4 },
    { date: "2026-07-21", watch: 5, caution: 6, warning: 6 },
    { date: "2026-07-28", watch: 8, caution: 9, warning: 10 },
    { date: "2026-08-01", watch: 11, caution: 13, warning: 15 },
    { date: "2026-08-03", watch: 14, caution: 16, warning: 21 },
  ],
  techniqueCounts: [
    { technique: "urgency", count: 41 },
    { technique: "authority", count: 27 },
    { technique: "social_proof", count: 22 },
    { technique: "secrecy", count: 18 },
    { technique: "emotional_bait", count: 16 },
    { technique: "scarcity", count: 15 },
    { technique: "fear", count: 12 },
    { technique: "bandwagon", count: 11 },
    { technique: "fabricated_evidence", count: 9 },
    { technique: "character_attack", count: 7 },
    { technique: "decontextualization", count: 6 },
  ],
  confirmationSplit: {
    aiDetected: 7,
    userReported: 5,
  },
  gallery: seedGallery,
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
