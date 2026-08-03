import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify, type Project, type Store } from "./project-schema";

/**
 * Flat-file JSON store. Deliberately dependency-free so the site runs on
 * any Node host with nothing to provision.
 *
 * ⚠️  It writes to disk, so it needs a persistent filesystem: a VPS,
 * Railway, Render, Fly, a cPanel Node app, or your own machine. It will NOT
 * work on Vercel/Netlify serverless, where the filesystem is read-only.
 *
 * To move to a database later, keep the exported function signatures below
 * and swap the bodies (e.g. a `projects` collection in MongoDB). Nothing
 * outside this file knows the storage format.
 *
 * Server-only: importing this from a client component breaks the browser
 * bundle. Client code should import from ./project-schema instead.
 */

export type { Project, Store } from "./project-schema";
export { CATEGORIES, sanitise, validate } from "./project-schema";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");

const EMPTY: Store = { projects: [], updatedAt: new Date(0).toISOString() };

export async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      updatedAt: parsed.updatedAt ?? EMPTY.updatedAt,
    };
  } catch {
    // Missing or corrupt file: start clean rather than crashing the page
    return EMPTY;
  }
}

/** Write via temp file + rename so a crash mid-write can't truncate the data. */
async function writeStore(store: Store): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await rename(tmp, DATA_FILE);
}

/* ------------------------------------------------------------------ */

export async function listProjects(): Promise<Project[]> {
  const { projects } = await readStore();
  return [...projects].sort((a, b) => a.order - b.order);
}

export async function createProject(
  data: Omit<Project, "id" | "order">,
): Promise<Project> {
  const store = await readStore();

  const base = slugify(data.title) || "project";
  let id = base;
  let n = 2;
  while (store.projects.some((p) => p.id === id)) id = `${base}-${n++}`;

  const minOrder = store.projects.reduce((m, p) => Math.min(m, p.order), 0);
  // New projects land at the top of the list
  const project: Project = { ...data, id, order: minOrder - 1 };

  store.projects.push(project);
  store.updatedAt = new Date().toISOString();
  await writeStore(store);

  return project;
}

export async function updateProject(
  id: string,
  data: Omit<Project, "id" | "order">,
): Promise<Project | null> {
  const store = await readStore();
  const index = store.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Project = { ...store.projects[index], ...data, id };
  store.projects[index] = updated;
  store.updatedAt = new Date().toISOString();
  await writeStore(store);

  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = await readStore();
  const next = store.projects.filter((p) => p.id !== id);
  if (next.length === store.projects.length) return false;

  store.projects = next;
  store.updatedAt = new Date().toISOString();
  await writeStore(store);

  return true;
}

/** Move a project one slot up or down in the public ordering. */
export async function reorderProject(
  id: string,
  direction: "up" | "down",
): Promise<boolean> {
  const store = await readStore();
  const sorted = [...store.projects].sort((a, b) => a.order - b.order);

  const index = sorted.findIndex((p) => p.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= sorted.length) return false;

  [sorted[index], sorted[target]] = [sorted[target], sorted[index]];
  // Rewrite orders densely so repeated moves stay stable
  sorted.forEach((p, i) => {
    p.order = i;
  });

  store.projects = sorted;
  store.updatedAt = new Date().toISOString();
  await writeStore(store);

  return true;
}
