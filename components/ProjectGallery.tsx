"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import type { Project } from "@/lib/project-schema";

/** Multiple of 4 so the widest grid fills complete rows */
const PAGE = 12;

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("All");
  const [shown, setShown] = useState(PAGE);

  /** Categories ordered by how many projects sit in each */
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

  const filtered = useMemo(
    () => (category === "All" ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  );

  const visible = filtered.slice(0, shown);
  const remaining = filtered.length - visible.length;

  const pick = (name: string) => {
    setCategory(name);
    setShown(PAGE);
  };

  return (
    <div>
      {/* ---------- filter tabs ---------- */}
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        {categories.map((c) => {
          const active = category === c.name;
          return (
            <button
              key={c.name}
              role="tab"
              aria-selected={active}
              onClick={() => pick(c.name)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? "border-accent-300/50 bg-accent-300/10 text-accent-300"
                  : "border-white/[0.09] bg-white/[0.03] text-mist-400 hover:border-white/20 hover:text-mist-50"
              }`}
            >
              {c.name}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  active ? "bg-accent-300/15" : "bg-white/[0.05] text-mist-500"
                }`}
              >
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- grid ---------- */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((project) => {
          const clickable = Boolean(project.link) && !project.privateDemo;

          const body = (
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 size-44 rounded-full bg-accent-400/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative flex items-start justify-between gap-3">
                <span className="text-[0.7rem] font-medium tracking-wide text-accent-300 uppercase">
                  {project.category}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  {project.featured && (
                    <Icon name="sparkles" className="size-4 text-ember-400" />
                  )}
                  {clickable && (
                    <Icon
                      name="arrow"
                      className="size-4 -rotate-45 text-mist-500 transition-all duration-300 group-hover:rotate-0 group-hover:text-mist-50"
                    />
                  )}
                </div>
              </div>

              <h3 className="relative mt-3 text-base font-semibold text-mist-50">
                {project.title}
              </h3>

              {project.summary && (
                <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-mist-400">
                  {project.summary}
                </p>
              )}

              <div className="relative mt-auto pt-4">
                {project.stack.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-white/[0.07] bg-ink-900/60 px-2 py-0.5 font-mono text-[0.7rem] text-mist-400"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                {project.privateDemo && (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-300/90">
                    <Icon name="shield" className="size-3.5" />
                    Demo access on request
                  </p>
                )}
              </div>
            </article>
          );

          return (
            <li key={project.id}>
              {clickable ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>

      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShown((s) => s + PAGE)}
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-medium text-mist-200 transition-all hover:border-white/25 hover:text-white"
          >
            Show {Math.min(remaining, PAGE)} more
            <span className="text-mist-500">({remaining} left)</span>
            <Icon
              name="arrow"
              className="size-4 rotate-90 transition-transform group-hover:translate-y-0.5"
            />
          </button>
        </div>
      )}
    </div>
  );
}
