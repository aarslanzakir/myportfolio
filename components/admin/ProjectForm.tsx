"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { CATEGORIES, type Project } from "@/lib/project-schema";

const field =
  "w-full rounded-xl border border-white/[0.09] bg-ink-900/70 px-4 py-3 text-sm text-mist-50 " +
  "placeholder:text-mist-500 focus:border-accent-300/60 focus:outline-none";
const label = "mb-2 block text-xs font-medium tracking-wide text-mist-400 uppercase";

export type ProjectDraft = {
  title: string;
  category: string;
  summary: string;
  stack: string;
  link: string;
  featured: boolean;
  privateDemo: boolean;
};

export const emptyDraft: ProjectDraft = {
  title: "",
  category: CATEGORIES[0],
  summary: "",
  stack: "",
  link: "",
  featured: false,
  privateDemo: false,
};

export const toDraft = (p: Project): ProjectDraft => ({
  title: p.title,
  category: p.category,
  summary: p.summary,
  stack: p.stack.join(", "),
  link: p.link,
  featured: p.featured,
  privateDemo: p.privateDemo,
});

export default function ProjectForm({
  initial,
  editingId,
  onCancel,
  onSaved,
}: {
  initial: ProjectDraft;
  /** null = creating a new project */
  editingId: string | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<ProjectDraft>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch(
        editingId ? `/api/projects/${encodeURIComponent(editingId)}` : "/api/projects",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );

      if (res.ok) {
        onSaved();
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? `Save failed (${res.status}).`);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-mist-50">
          {editingId ? "Edit project" : "Add a project"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="grid size-9 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-mist-400 hover:text-white"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="f-title" className={label}>
            Project title *
          </label>
          <input
            id="f-title"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            required
            maxLength={120}
            placeholder="Velano Transport"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="f-category" className={label}>
            Category *
          </label>
          <select
            id="f-category"
            value={draft.category}
            onChange={(e) => set("category", e.target.value)}
            className={field}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-ink-900">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-link" className={label}>
            Live URL
          </label>
          <input
            id="f-link"
            value={draft.link}
            onChange={(e) => set("link", e.target.value)}
            placeholder="example.com"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="f-summary" className={label}>
            Summary
          </label>
          <textarea
            id="f-summary"
            value={draft.summary}
            onChange={(e) => set("summary", e.target.value)}
            rows={4}
            maxLength={600}
            placeholder="What the project does and what you built."
            className={`${field} resize-y`}
          />
          <p className="mt-1.5 text-right text-xs text-mist-500">
            {draft.summary.length}/600
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="f-stack" className={label}>
            Tech stack <span className="normal-case">(comma separated)</span>
          </label>
          <input
            id="f-stack"
            value={draft.stack}
            onChange={(e) => set("stack", e.target.value)}
            placeholder="Next.js, Node.js, MongoDB"
            className={field}
          />
        </div>
      </div>

      {/* toggles */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.09] bg-white/[0.02] p-4">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="mt-0.5 size-4 accent-accent-400"
          />
          <span>
            <span className="block text-sm font-medium text-mist-50">
              Feature this project
            </span>
            <span className="mt-0.5 block text-xs text-mist-500">
              Shows in the highlighted grid at the top of the Work section.
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.09] bg-white/[0.02] p-4">
          <input
            type="checkbox"
            checked={draft.privateDemo}
            onChange={(e) => set("privateDemo", e.target.checked)}
            className="mt-0.5 size-4 accent-accent-400"
          />
          <span>
            <span className="block text-sm font-medium text-mist-50">
              Needs login to view
            </span>
            <span className="mt-0.5 block text-xs text-mist-500">
              Hides the public link and shows &ldquo;demo access on request&rdquo;
              instead. Never put credentials on the site.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-6 py-3.5 text-sm font-medium text-ink-950 transition-all hover:brightness-110 disabled:opacity-60"
        >
          <Icon name="check" className="size-4" />
          {busy ? "Saving…" : editingId ? "Save changes" : "Add project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-mist-200 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
