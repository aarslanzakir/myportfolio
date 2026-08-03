/**
 * Types and pure helpers shared by the server store and the admin UI.
 *
 * Kept free of any Node built-ins on purpose: client components import
 * CATEGORIES from here, and anything touching `node:fs` would break the
 * browser bundle.
 */

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  stack: string[];
  link: string;
  featured: boolean;
  /** Link needs credentials: card shows "demo access on request" instead */
  privateDemo: boolean;
  order: number;
};

export type Store = {
  projects: Project[];
  updatedAt: string;
};

export const CATEGORIES = [
  "Web Development",
  "MERN Stack",
  "Next.js",
  "Laravel",
  "WordPress",
  "Mobile Apps",
  "Blockchain",
  "AI & Automation",
  "Python & React",
] as const;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

/** Normalises whatever the admin form sent into a valid Project shape. */
export function sanitise(
  input: Record<string, unknown>,
  existing?: Project,
): Omit<Project, "id" | "order"> {
  const str = (key: string, fallback = "") => {
    const v = input[key];
    return typeof v === "string" ? v.trim() : fallback;
  };

  const rawStack = input.stack;
  const stack = Array.isArray(rawStack)
    ? rawStack.map((s) => String(s).trim()).filter(Boolean)
    : String(rawStack ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  let link = str("link", existing?.link ?? "");
  // Accept "example.com" and turn it into a real URL
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;

  return {
    title: str("title", existing?.title ?? ""),
    category: str("category", existing?.category ?? CATEGORIES[0]),
    summary: str("summary", existing?.summary ?? ""),
    stack,
    link,
    featured: Boolean(input.featured),
    privateDemo: Boolean(input.privateDemo),
  };
}

/** Field-level validation: returns a list of human-readable problems. */
export function validate(p: {
  title: string;
  summary: string;
  link: string;
}): string[] {
  const errors: string[] = [];

  if (p.title.length < 2) errors.push("Title must be at least 2 characters.");
  if (p.title.length > 120) errors.push("Title must be under 120 characters.");
  if (p.summary.length > 600) errors.push("Summary must be under 600 characters.");

  if (p.link) {
    try {
      const url = new URL(p.link);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.push("Link must be an http or https URL.");
      }
    } catch {
      errors.push("Link is not a valid URL.");
    }
  }

  return errors;
}
