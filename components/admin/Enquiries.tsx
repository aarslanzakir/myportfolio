"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import type { Enquiry } from "@/lib/enquiries";

function timeAgo(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";

  const units: [number, string][] = [
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.35, "week"],
    [12, "month"],
  ];

  let value = seconds / 60;
  let label = "minute";
  for (let i = 1; i < units.length; i++) {
    if (value < units[i][0]) break;
    value /= units[i][0];
    label = units[i][1];
  }

  const n = Math.floor(value);
  return `${n} ${label}${n === 1 ? "" : "s"} ago`;
}

const stamp = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function Enquiries({
  enquiries,
  durable,
}: {
  enquiries: Enquiry[];
  durable: boolean;
}) {
  const router = useRouter();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const unreadCount = enquiries.filter((e) => !e.read).length;

  const visible = useMemo(
    () => (filter === "unread" ? enquiries.filter((e) => !e.read) : enquiries),
    [enquiries, filter],
  );

  const setRead = async (enquiry: Enquiry, read: boolean) => {
    setBusyId(enquiry.id);
    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(enquiry.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (enquiry: Enquiry) => {
    const ok = window.confirm(
      `Delete the enquiry from ${enquiry.name}? This cannot be undone.`,
    );
    if (!ok) return;

    setBusyId(enquiry.id);
    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(enquiry.id)}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const replyHref = (e: Enquiry) =>
    `mailto:${e.email}?subject=${encodeURIComponent(
      `Re: your enquiry about ${e.type}`,
    )}&body=${encodeURIComponent(`Hi ${e.name.split(" ")[0]},\n\n`)}`;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink-950/85 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-semibold text-mist-50">Enquiries</h1>
          <p className="text-xs text-mist-500">
            {enquiries.length} total
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-current={filter === f ? "true" : undefined}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                filter === f
                  ? "bg-accent-400/15 text-mist-50"
                  : "text-mist-400 hover:bg-white/[0.04] hover:text-mist-50"
              }`}
            >
              {f === "all" ? "All" : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
      </header>

      {!durable && (
        <p className="mx-4 mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 sm:mx-6">
          Enquiries are being saved to <code>data/enquiries.json</code> on disk. That
          works locally and on a VPS, but on Vercel the filesystem is read-only, so
          submissions there will fail and visitors get sent to WhatsApp instead. Attach
          an Upstash Redis store from the Vercel Storage tab and this switches over
          automatically.
        </p>
      )}

      <ul className="grid gap-3 p-4 sm:p-6 2xl:grid-cols-2">
        {visible.map((enquiry) => {
          const open = expanded === enquiry.id;
          return (
            <li
              key={enquiry.id}
              className={`rounded-2xl border bg-white/[0.025] p-4 transition-opacity sm:p-5 ${
                enquiry.read
                  ? "border-white/[0.07]"
                  : "border-accent-300/30 bg-accent-300/[0.04]"
              } ${busyId === enquiry.id ? "opacity-50" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {!enquiry.read && (
                  <span className="size-2 shrink-0 rounded-full bg-accent-300" aria-hidden />
                )}
                <h2 className="text-base font-medium text-mist-50">{enquiry.name}</h2>
                {enquiry.company && (
                  <span className="text-sm text-mist-400">· {enquiry.company}</span>
                )}
                <span className="ml-auto text-xs text-mist-500" title={stamp(enquiry.createdAt)}>
                  {timeAgo(enquiry.createdAt)}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="truncate font-mono text-xs text-accent-300 hover:underline"
                >
                  {enquiry.email}
                </a>
                <span className="rounded-full border border-white/[0.09] bg-white/[0.04] px-2 py-0.5 text-[0.65rem] text-mist-300">
                  {enquiry.type}
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] text-emerald-300">
                  {enquiry.budget}
                </span>
              </div>

              <p
                className={`mt-3 text-sm whitespace-pre-wrap text-mist-300 ${
                  open ? "" : "line-clamp-3"
                }`}
              >
                {enquiry.message}
              </p>

              {enquiry.message.length > 180 && (
                <button
                  onClick={() => setExpanded(open ? null : enquiry.id)}
                  className="mt-1.5 text-xs text-accent-300 hover:underline"
                >
                  {open ? "Show less" : "Show more"}
                </button>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <a
                  href={replyHref(enquiry)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2 text-sm text-mist-200 hover:text-white"
                >
                  <Icon name="mail" className="size-4" />
                  Reply
                </a>
                <button
                  onClick={() => setRead(enquiry, !enquiry.read)}
                  disabled={busyId !== null}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2 text-sm text-mist-200 hover:text-white disabled:opacity-40"
                >
                  <Icon name="check" className="size-4" />
                  {enquiry.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  onClick={() => remove(enquiry)}
                  disabled={busyId !== null}
                  aria-label={`Delete enquiry from ${enquiry.name}`}
                  className="grid size-9 place-items-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/20 disabled:opacity-40"
                >
                  <Icon name="close" className="size-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="mx-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] py-12 text-center text-sm text-mist-400 sm:mx-6">
          {enquiries.length === 0
            ? "No enquiries yet. Messages sent through the contact form land here."
            : "Nothing unread."}
        </p>
      )}
    </>
  );
}
