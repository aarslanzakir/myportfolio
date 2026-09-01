/**
 * ============================================================
 *  CASE STUDIES
 *
 *  Long-form write-ups of your best work. These are NOT the 78
 *  entries in data/content.json: those are cards with a one-line
 *  summary, and publishing 78 pages of ~100 characters each is
 *  thin content that Google penalises site-wide.
 *
 *  A case study earns its own URL because it says something a
 *  card cannot: what was actually wrong, what you did about it,
 *  and what changed. Aim for 5-8 of them, 400+ words each.
 *
 *  HOW TO ADD ONE
 *  --------------
 *  1. Copy TEMPLATE at the bottom of this file.
 *  2. Fill in every field. Write plainly; specifics beat adjectives.
 *  3. Push it into `caseStudies` below.
 *  4. Commit. The page, its metadata, its schema, its preview card
 *     and its sitemap entry are all generated for you.
 *
 *  Nothing is published until you do that: an empty array means
 *  zero routes, which is correct. Half-written pages would cost
 *  you more in ranking than they would gain.
 * ============================================================
 */

export type CaseStudy = {
  /** URL segment: /case-studies/<slug>. Never change it once live. */
  slug: string;
  /** id of the matching entry in data/content.json, if there is one */
  projectId?: string;

  title: string;
  /** <title> for the page. The root layout appends "| <name>". */
  metaTitle: string;
  /** 150-160 characters. What a searcher sees under the title. */
  metaDescription: string;

  /** Client name, or something like "Confidential fintech client" */
  client: string;
  /** e.g. "2024" */
  year: string;
  /** Your role, e.g. "Sole developer" or "Lead front-end" */
  role: string;
  /** e.g. "6 weeks" */
  duration: string;

  /** Slugs from lib/services.ts. Cross-links the page to the service. */
  services: string[];
  stack: string[];

  /** Live URL. Omit if the work is private. */
  link?: string;

  /** The situation before you. One string per paragraph. */
  challenge: string[];
  /** What you built and, more importantly, why that way. */
  approach: string[];
  /** What changed. Be honest; "still shipping" beats invented metrics. */
  outcome: string[];

  /**
   * Hard numbers only. Leave empty rather than inventing figures:
   * a fabricated metric is the fastest way to lose a client who
   * checks, and Google does not reward them either way.
   */
  results?: { label: string; value: string }[];

  /** Only with the client's permission, quoted verbatim. */
  testimonial?: { quote: string; author: string; role: string };
};

/**
 * Published case studies. Empty until you write real ones.
 * Order here is the order they appear on /case-studies.
 */
export const caseStudies: CaseStudy[] = [];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((study) => study.slug === slug);

/** Case studies tagged with a given service slug, for cross-linking. */
export const caseStudiesForService = (serviceSlug: string) =>
  caseStudies.filter((study) => study.services.includes(serviceSlug));

/**
 * ------------------------------------------------------------------
 *  TEMPLATE — copy this, fill it in, add it to `caseStudies` above.
 *
 *  Not exported into the array, so it never renders. The guidance in
 *  each field is what makes the difference between a page that ranks
 *  and a page that reads like a brochure.
 * ------------------------------------------------------------------
 *
 * {
 *   slug: "acme-booking-platform",
 *   projectId: "acme-booking",
 *   title: "Rebuilding a booking platform that buckled under its own traffic",
 *   metaTitle: "Booking Platform Rebuild (Next.js & Node)",
 *   metaDescription:
 *     "How I rebuilt a booking platform that timed out under load, cutting " +
 *     "checkout failures and giving the team a deploy process they could run.",
 *
 *   client: "Acme Travel",
 *   year: "2024",
 *   role: "Sole developer",
 *   duration: "9 weeks",
 *
 *   services: ["full-stack-web-development"],
 *   stack: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
 *   link: "https://example.com",
 *
 *   // What was actually wrong. Concrete beats dramatic: "checkout timed
 *   // out above ~200 concurrent users" is worth more than "poor performance".
 *   challenge: [
 *     "...",
 *   ],
 *
 *   // What you did AND why that choice over the obvious alternative.
 *   // The reasoning is what shows a prospect how you think.
 *   approach: [
 *     "...",
 *   ],
 *
 *   // What changed. If you have no numbers, say what shipped and what the
 *   // client can now do that they could not before. Do not invent figures.
 *   outcome: [
 *     "...",
 *   ],
 *
 *   results: [
 *     { label: "Checkout completion", value: "+31%" },
 *   ],
 *
 *   testimonial: {
 *     quote: "...",
 *     author: "Jane Doe",
 *     role: "CTO, Acme Travel",
 *   },
 * }
 */
