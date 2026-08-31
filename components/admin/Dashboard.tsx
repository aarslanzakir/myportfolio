"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { profile } from "@/lib/content";
import type { Enquiry } from "@/lib/enquiries";
import type { Project } from "@/lib/project-schema";
import Enquiries from "./Enquiries";
import ProjectForm, { emptyDraft, toDraft, type ProjectDraft } from "./ProjectForm";

export default function Dashboard({
  projects,
  enquiries,
  durableEnquiries,
}: {
  projects: Project[];
  enquiries: Enquiry[];
  durableEnquiries: boolean;
}) {
  const router = useRouter();

  const [view, setView] = useState<"projects" | "enquiries">("projects");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [
      { name: "All", count: projects.length },
      ...Array.from(counts, ([name, count]) => ({ name, count })).sort(
        (a, b) => b.count - a.count,
      ),
    ];
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.stack.join(" ").toLowerCase().includes(q) ||
        p.link.toLowerCase().includes(q)
      );
    });
  }, [projects, query, category]);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3500);
  };

  const openNew = () => {
    setView("projects");
    setEditingId(null);
    setDraft(emptyDraft);
    setSidebarOpen(false);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setDraft(toDraft(project));
  };

  const closeForm = () => {
    setDraft(null);
    setEditingId(null);
  };

  /* Escape closes the modal first, then the mobile drawer.
     Declared after closeForm so the handler always sees the current one. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (draft) {
        setDraft(null);
        setEditingId(null);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft]);

  /* Lock background scroll while the modal is open */
  useEffect(() => {
    document.body.style.overflow = draft ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [draft]);

  const afterSave = () => {
    closeForm();
    router.refresh();
    flash("Saved. The public site has been updated.");
  };

  const remove = async (project: Project) => {
    const ok = window.confirm(
      `Delete "${project.title}"? This removes it from the live site and cannot be undone.`,
    );
    if (!ok) return;

    setBusyId(project.id);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
        flash(`Deleted "${project.title}".`);
      } else {
        flash("Delete failed.");
      }
    } finally {
      setBusyId(null);
    }
  };

  const move = async (project: Project, direction: "up" | "down") => {
    setBusyId(project.id);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move: direction }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  };

  const featuredCount = projects.filter((p) => p.featured).length;
  const unreadEnquiries = enquiries.filter((e) => !e.read).length;
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  /* ---------------------------------------------------------------- */

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-5">
      {/* brand */}
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-300 via-accent-400 to-ember-400 text-xs font-bold text-ink-950">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-mist-50">{profile.name}</p>
          <p className="text-xs text-mist-500">Project manager</p>
        </div>
      </div>

      {/* view switch */}
      <nav aria-label="Sections" className="flex flex-col gap-0.5">
        {([
          { id: "projects", label: "Projects", icon: "layers", badge: 0 },
          { id: "enquiries", label: "Enquiries", icon: "mail", badge: unreadEnquiries },
        ] as const).map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setSidebarOpen(false);
              }}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                active
                  ? "bg-accent-400/15 text-mist-50"
                  : "text-mist-400 hover:bg-white/[0.04] hover:text-mist-50"
              }`}
            >
              <Icon name={item.icon} className="size-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="rounded-full bg-accent-300 px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={openNew}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-4 py-3 text-sm font-medium text-ink-950 transition-all hover:brightness-110"
      >
        <Icon name="plus" className="size-4" />
        New project
      </button>

      {/* counters */}
      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
          <dt className="text-[0.65rem] tracking-wide text-mist-500 uppercase">Total</dt>
          <dd className="text-lg font-semibold text-mist-50">{projects.length}</dd>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
          <dt className="text-[0.65rem] tracking-wide text-mist-500 uppercase">
            Featured
          </dt>
          <dd className="text-lg font-semibold text-mist-50">{featuredCount}</dd>
        </div>
      </dl>

      {/* category nav */}
      <nav aria-label="Filter by category" className="min-h-0 flex-1 overflow-y-auto">
        <p className="mb-2 px-1 text-[0.65rem] font-semibold tracking-[0.12em] text-mist-500 uppercase">
          Categories
        </p>
        <ul className="flex flex-col gap-0.5">
          {categories.map((c) => {
            const active = category === c.name;
            return (
              <li key={c.name}>
                <button
                  onClick={() => {
                    setView("projects");
                    setCategory(c.name);
                    setSidebarOpen(false);
                  }}
                  aria-current={active ? "true" : undefined}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-accent-400/15 text-mist-50"
                      : "text-mist-400 hover:bg-white/[0.04] hover:text-mist-50"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs ${
                      active
                        ? "bg-accent-400/25 text-accent-300"
                        : "bg-white/[0.05] text-mist-500"
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* footer actions */}
      <div className="flex flex-col gap-2 border-t border-white/[0.07] pt-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist-400 transition-colors hover:bg-white/[0.04] hover:text-mist-50"
        >
          <Icon name="arrow" className="size-4 -rotate-45" />
          View live site
        </Link>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist-400 transition-colors hover:bg-white/[0.04] hover:text-mist-50"
        >
          <Icon name="close" className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh w-full">
      {/* ---------- sidebar: static on desktop ---------- */}
      <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 border-r border-white/[0.07] bg-ink-900/60 lg:block">
        {sidebar}
      </aside>

      {/* ---------- sidebar: drawer on mobile ---------- */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/[0.07] bg-ink-900">
            {sidebar}
          </aside>
        </div>
      )}

      {/* ---------- main ---------- */}
      <main className="flex min-w-0 flex-1 flex-col">
        {view === "enquiries" ? (
          <Enquiries enquiries={enquiries} durable={durableEnquiries} />
        ) : (
          <>
          {/* toolbar */}
          <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-mist-200 lg:hidden"
              >
                <Icon name="menu" className="size-5" />
              </button>

              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search projects</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, stack or URL…"
                  className="w-full rounded-xl border border-white/[0.09] bg-ink-900/70 px-4 py-2.5 text-sm text-mist-50 placeholder:text-mist-500 focus:border-accent-300/60 focus:outline-none"
                />
              </label>

              <button
                onClick={openNew}
                className="hidden shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-4 py-2.5 text-sm font-medium text-ink-950 hover:brightness-110 sm:inline-flex lg:hidden"
              >
                <Icon name="plus" className="size-4" />
                New
              </button>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 pb-3 text-sm sm:px-6">
              <h1 className="font-semibold text-mist-50">
                {category === "All" ? "All projects" : category}
              </h1>
              <p className="text-xs text-mist-500">
                {visible.length} shown
                {query && ` · matching “${query}”`}
              </p>
            </div>
          </header>

          {notice && (
            <p
              role="status"
              className="mx-4 mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 sm:mx-6"
            >
              {notice}
            </p>
          )}

          {/* project list: full width, denser on very wide screens */}
          <ul className="grid gap-3 p-4 sm:p-6 2xl:grid-cols-2">
            {visible.map((project) => {
              const globalIndex = projects.findIndex((p) => p.id === project.id);

              return (
                <li
                  key={project.id}
                  className={`rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-opacity sm:p-5 ${
                    busyId === project.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-mist-500">
                          {globalIndex + 1}
                        </span>
                        <h2 className="text-base font-medium text-mist-50">
                          {project.title}
                        </h2>
                        {project.featured && (
                          <span className="rounded-full border border-ember-400/40 bg-ember-400/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-ember-400 uppercase">
                            Featured
                          </span>
                        )}
                        {project.privateDemo && (
                          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-amber-300 uppercase">
                            Private
                          </span>
                        )}
                        {globalIndex < 2 && (
                          <span className="rounded-full border border-accent-300/40 bg-accent-300/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-accent-300 uppercase">
                            Spotlight
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-mist-500">{project.category}</p>

                      {project.summary && (
                        <p className="mt-2 line-clamp-2 text-sm text-mist-400">
                          {project.summary}
                        </p>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate font-mono text-xs text-accent-300 hover:underline"
                          >
                            {project.link.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-mist-500">no link</span>
                        )}
                        {project.stack.length > 0 && (
                          <span className="truncate font-mono text-xs text-mist-500">
                            {project.stack.join(" · ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* row actions */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => move(project, "up")}
                        disabled={globalIndex === 0 || busyId !== null}
                        aria-label={`Move ${project.title} up`}
                        className="grid size-9 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-mist-400 hover:text-white disabled:opacity-30"
                      >
                        <Icon name="arrow" className="size-4 -rotate-90" />
                      </button>
                      <button
                        onClick={() => move(project, "down")}
                        disabled={globalIndex === projects.length - 1 || busyId !== null}
                        aria-label={`Move ${project.title} down`}
                        className="grid size-9 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-mist-400 hover:text-white disabled:opacity-30"
                      >
                        <Icon name="arrow" className="size-4 rotate-90" />
                      </button>
                      <button
                        onClick={() => openEdit(project)}
                        className="rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2 text-sm text-mist-200 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(project)}
                        aria-label={`Delete ${project.title}`}
                        className="grid size-9 place-items-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                      >
                        <Icon name="close" className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {visible.length === 0 && (
            <p className="mx-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] py-12 text-center text-sm text-mist-400 sm:mx-6">
              No projects match that filter.
            </p>
          )}

          <p className="mt-auto px-6 py-8 text-center text-xs leading-relaxed text-mist-500">
            The first two projects get the large spotlight cards on the public site.
            Use ↑ / ↓ to choose them. Data lives in{" "}
            <code className="text-mist-400">data/content.json</code>; never save client
            passwords into a project record.
          </p>
          </>
        )}
      </main>

      {/* ---------- edit / create modal ---------- */}
      {draft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingId ? "Edit project" : "Add a project"}
          className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
        >
          <button
            aria-label="Close"
            onClick={closeForm}
            className="fixed inset-0 bg-ink-950/85 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-2xl">
            <ProjectForm
              key={editingId ?? "new"}
              initial={draft}
              editingId={editingId}
              onCancel={closeForm}
              onSaved={afterSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
