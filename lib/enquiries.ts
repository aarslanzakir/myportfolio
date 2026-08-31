import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

/**
 * Storage for contact-form enquiries.
 *
 * Two backends, picked automatically:
 *
 *  1. Redis over REST — used when KV_REST_API_URL and KV_REST_API_TOKEN are
 *     set. Vercel injects exactly those when you attach an Upstash Redis
 *     store from the Storage tab (free tier, no key to copy by hand). This
 *     is the one that works on Vercel, where the filesystem is read-only.
 *
 *  2. JSON file at data/enquiries.json — the fallback. Works locally and on
 *     any host with a persistent disk (VPS, Railway, Render, cPanel).
 *
 * Same shape as lib/store.ts: nothing outside this file knows the format.
 *
 * Server-only. Client code should not import this.
 */

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  type: string;
  budget: string;
  message: string;
  /** ISO timestamp of when it arrived */
  createdAt: string;
  read: boolean;
};

export type NewEnquiry = Omit<Enquiry, "id" | "createdAt" | "read">;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.json");
const KV_KEY = "portfolio:enquiries";

/* ------------------------- backend: Redis REST ------------------------- */

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

/** Runs one Redis command through the REST API. No SDK needed. */
async function kvCommand(command: unknown[]): Promise<unknown> {
  const config = kvConfig();
  if (!config) throw new Error("KV is not configured.");

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status} ${response.statusText}`);
  }

  const body = (await response.json()) as { result?: unknown; error?: string };
  if (body.error) throw new Error(`KV error: ${body.error}`);
  return body.result;
}

/* ---------------------------- backend: file ---------------------------- */

async function readFileStore(): Promise<Enquiry[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Enquiry[]) : [];
  } catch {
    // Missing or corrupt file: start clean rather than crashing the page
    return [];
  }
}

/** Write via temp file + rename so a crash mid-write can't truncate the data. */
async function writeFileStore(list: Enquiry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await rename(tmp, DATA_FILE);
}

/* ------------------------------- public -------------------------------- */

/** True when enquiries survive a redeploy on a read-only host like Vercel. */
export function usesDurableStorage(): boolean {
  return kvConfig() !== null;
}

async function readAll(): Promise<Enquiry[]> {
  if (!kvConfig()) return readFileStore();

  const raw = await kvCommand(["GET", KV_KEY]);
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Enquiry[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(list: Enquiry[]): Promise<void> {
  if (!kvConfig()) return writeFileStore(list);
  await kvCommand(["SET", KV_KEY, JSON.stringify(list)]);
}

/** Newest first. */
export async function listEnquiries(): Promise<Enquiry[]> {
  const list = await readAll();
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createEnquiry(data: NewEnquiry): Promise<Enquiry> {
  const list = await readAll();

  const enquiry: Enquiry = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  list.push(enquiry);
  // Keep the store from growing without bound; 500 is far more than a
  // portfolio form will ever need to keep on hand.
  await writeAll(list.slice(-500));

  return enquiry;
}

export async function markEnquiry(id: string, read: boolean): Promise<boolean> {
  const list = await readAll();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return false;

  list[index] = { ...list[index], read };
  await writeAll(list);
  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const list = await readAll();
  const next = list.filter((e) => e.id !== id);
  if (next.length === list.length) return false;

  await writeAll(next);
  return true;
}
