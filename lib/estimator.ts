/**
 * ============================================================
 *  PROJECT ESTIMATOR: deterministic scoping engine
 *
 *  Runs entirely in the browser. No API key, no network call,
 *  no cost per use. It is a rule engine, not a language model:
 *  the same answers always produce the same estimate, which is
 *  what you want for something a client may hold you to.
 *
 *  To retune it, change the numbers here. Nothing in the UI
 *  hard-codes an estimate.
 * ============================================================
 */

export type ProjectType = {
  id: string;
  label: string;
  hint: string;
  icon: string;
  /** Baseline build effort in weeks, before size and features */
  weeks: number;
  stack: string[];
  /** Phases specific to this kind of build */
  phases: string[];
};

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "website",
    label: "Business website",
    hint: "Marketing site, brochure, landing pages",
    icon: "code",
    weeks: 2,
    stack: ["Next.js", "Tailwind CSS", "WordPress"],
    phases: ["Design & content structure", "Build & CMS wiring", "SEO & launch"],
  },
  {
    id: "ecommerce",
    label: "Online store",
    hint: "Products, cart, checkout, orders",
    icon: "plug",
    weeks: 5,
    stack: ["Next.js", "Stripe", "PostgreSQL"],
    phases: [
      "Catalogue & data model",
      "Storefront build",
      "Checkout & payments",
      "Admin & fulfilment",
    ],
  },
  {
    id: "webapp",
    label: "Web app or SaaS",
    hint: "Dashboards, accounts, business logic",
    icon: "layers",
    weeks: 7,
    stack: ["Next.js", "Node.js", "PostgreSQL", "Prisma"],
    phases: [
      "Architecture & data model",
      "Core product build",
      "Admin & reporting",
      "Hardening & launch",
    ],
  },
  {
    id: "mobile",
    label: "Mobile app",
    hint: "iOS and Android from one codebase",
    icon: "phone",
    weeks: 8,
    stack: ["React Native", "Expo", "Node.js", "MongoDB"],
    phases: [
      "Screen flow & data model",
      "App build",
      "Back-end & sync",
      "Store submission",
    ],
  },
  {
    id: "ai",
    label: "AI or automation",
    hint: "Chatbot, document pipeline, workflow",
    icon: "sparkles",
    weeks: 4,
    stack: ["Python", "FastAPI", "Claude API", "Vector DB"],
    phases: [
      "Data & prompt design",
      "Pipeline build",
      "Evaluation & tuning",
      "Integration",
    ],
  },
  {
    id: "web3",
    label: "Blockchain / Web3",
    hint: "Tokens, NFTs, DAO, wallet integration",
    icon: "shield",
    weeks: 8,
    stack: ["Solidity", "Ethers.js", "Next.js", "Node.js"],
    phases: [
      "Contract design",
      "Contract build & tests",
      "dApp front-end",
      "Audit prep & deploy",
    ],
  },
  {
    id: "rescue",
    label: "Fix or extend existing",
    hint: "Someone else started it, you need it finished",
    icon: "check",
    weeks: 3,
    stack: ["Depends on your codebase"],
    phases: ["Codebase audit", "Stabilise & fix", "Build the additions"],
  },
];

export const SIZES = [
  { id: "small", label: "Small", hint: "A handful of pages or screens", factor: 0.65 },
  { id: "medium", label: "Medium", hint: "A real product with several areas", factor: 1 },
  { id: "large", label: "Large", hint: "Many modules, roles and edge cases", factor: 1.7 },
];

export type Feature = {
  id: string;
  label: string;
  weeks: number;
  stack?: string[];
};

export const FEATURES: Feature[] = [
  { id: "auth", label: "User accounts & login", weeks: 1, stack: ["Auth.js"] },
  { id: "payments", label: "Payments or subscriptions", weeks: 1.5, stack: ["Stripe"] },
  { id: "admin", label: "Admin dashboard", weeks: 1.5 },
  { id: "aifeat", label: "AI features (chat, search)", weeks: 2, stack: ["Claude API"] },
  { id: "integrations", label: "Third-party integrations", weeks: 1 },
  { id: "realtime", label: "Real-time or live updates", weeks: 1.5, stack: ["WebSockets"] },
  { id: "multilang", label: "Multiple languages", weeks: 1 },
  { id: "companion", label: "Companion mobile app", weeks: 3, stack: ["React Native"] },
];

export const TIMELINES = [
  { id: "flexible", label: "Flexible", hint: "Quality over speed", factor: 1 },
  { id: "normal", label: "Next 2 to 3 months", hint: "A normal pace", factor: 1 },
  { id: "rush", label: "As soon as possible", hint: "Compressed schedule", factor: 0.8 },
];

export type Answers = {
  type: string;
  size: string;
  features: string[];
  timeline: string;
};

export type Estimate = {
  minWeeks: number;
  maxWeeks: number;
  stack: string[];
  phases: { name: string; weeks: number }[];
  model: { title: string; why: string };
  notes: string[];
  rush: boolean;
};

const round = (n: number) => Math.max(1, Math.round(n));

export function estimate(answers: Answers): Estimate | null {
  const type = PROJECT_TYPES.find((t) => t.id === answers.type);
  const size = SIZES.find((s) => s.id === answers.size);
  const timeline = TIMELINES.find((t) => t.id === answers.timeline);
  if (!type || !size || !timeline) return null;

  const chosen = FEATURES.filter((f) => answers.features.includes(f.id));
  const featureWeeks = chosen.reduce((sum, f) => sum + f.weeks, 0);

  // Base build scales with size; features are additive on top of it.
  const core = type.weeks * size.factor + featureWeeks;

  // A rush timeline doesn't reduce the work, it just means more of it
  // runs in parallel, so the calendar shrinks while the range widens.
  const centre = core * timeline.factor;

  // Every phase needs at least a week, so a project can never be quoted
  // for less time than its own phase breakdown adds up to.
  const count = type.phases.length;
  const total = Math.max(Math.round(centre), count);

  // Weight the middle phases, where most of the work actually lands.
  const weights = type.phases.map((_, i, arr) =>
    i === 0 || i === arr.length - 1 ? 0.8 : 1.2,
  );
  const weightTotal = weights.reduce((a, b) => a + b, 0);

  // Largest-remainder apportionment: the parts always sum to `total`,
  // so the breakdown shown to the client reconciles with the headline.
  const raw = weights.map((w) => (total * w) / weightTotal);
  const weeks = raw.map((r) => Math.max(1, Math.floor(r)));
  const byFraction = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);

  let drift = total - weeks.reduce((a, b) => a + b, 0);
  for (let k = 0; drift > 0; k++, drift--) weeks[byFraction[k % count].i] += 1;
  // Defensive: only reachable if the weights above are ever retuned so
  // that the one-week floor pushes the sum past the total.
  for (let k = 0; drift < 0; k++) {
    const idx = byFraction[k % count].i;
    if (weeks[idx] > 1) {
      weeks[idx] -= 1;
      drift++;
    }
  }

  const phases = type.phases.map((name, i) => ({ name, weeks: weeks[i] }));

  // Range is built around the apportioned total, so it always contains it.
  const minWeeks = round(total * 0.85);
  const maxWeeks = Math.max(minWeeks + 1, round(total * 1.25));

  const stack = Array.from(
    new Set([...type.stack, ...chosen.flatMap((f) => f.stack ?? [])]),
  );

  // Which engagement model genuinely fits, following the same logic
  // described in the Pricing section.
  let model: Estimate["model"];
  if (answers.type === "rescue" || centre < 3) {
    model = {
      title: "Hourly",
      why: "The scope isn't fully knowable up front, so paying for the hours actually used costs you less than padding a fixed quote.",
    };
  } else if (centre > 10 || answers.features.length >= 4) {
    model = {
      title: "Weekly",
      why: "A build this size will evolve as you see it working. Booking capacity by the week keeps that flexible without re-quoting every change.",
    };
  } else {
    model = {
      title: "Fixed price",
      why: "This is well-defined enough to put a single number against, so you carry none of the risk on the estimate.",
    };
  }

  const notes: string[] = [];
  if (timeline.factor < 1) {
    notes.push(
      "A compressed schedule runs more work in parallel. It shortens the calendar, not the effort.",
    );
  }
  if (answers.features.includes("payments")) {
    notes.push(
      "Payments carry compliance and testing time that is easy to underestimate. It is costed in above.",
    );
  }
  if (answers.type === "mobile" || answers.features.includes("companion")) {
    notes.push(
      "App Store and Play review typically adds 3 to 7 days after the build is finished.",
    );
  }
  if (answers.type === "web3") {
    notes.push(
      "Contracts are immutable once deployed, so the test and review phase is deliberately generous.",
    );
  }
  if (answers.type === "rescue") {
    notes.push(
      "The audit comes first. If rebuilding turns out cheaper than extending, I will tell you that before you commit.",
    );
  }

  return { minWeeks, maxWeeks, stack, phases, model, notes, rush: timeline.factor < 1 };
}

/** The plain-text brief handed to WhatsApp or email. */
export function buildBrief(answers: Answers, result: Estimate): string {
  const type = PROJECT_TYPES.find((t) => t.id === answers.type);
  const size = SIZES.find((s) => s.id === answers.size);
  const timeline = TIMELINES.find((t) => t.id === answers.timeline);
  const features = FEATURES.filter((f) => answers.features.includes(f.id)).map(
    (f) => f.label,
  );

  return [
    "Hi Ali, I used the estimator on your site. Here is my project:",
    "",
    `Type: ${type?.label ?? "-"}`,
    `Size: ${size?.label ?? "-"}`,
    `Timeline: ${timeline?.label ?? "-"}`,
    `Features: ${features.length ? features.join(", ") : "None selected"}`,
    "",
    `Estimated at ${result.minWeeks} to ${result.maxWeeks} weeks on a ${result.model.title.toLowerCase()} basis.`,
    "",
    "Can we book a discovery call?",
  ].join("\n");
}
