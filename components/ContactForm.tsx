"use client";

import { useState } from "react";
import Icon from "./Icon";
import { profile } from "@/lib/content";

const PROJECT_TYPES = [
  "Web application (MERN / MEAN)",
  "Mobile app",
  "AI integration or automation",
  "Python / back-end work",
  "API or third-party integration",
  "Fixing or extending an existing app",
  "Not sure yet, need advice",
];

const BUDGETS = [
  "Under $1,000",
  "$1,000 to $5,000",
  "$5,000 to $15,000",
  "$15,000+",
  "Prefer to discuss",
];

const fieldClass =
  "w-full rounded-xl border border-white/[0.09] bg-ink-900/70 px-4 py-3 text-sm text-mist-50 " +
  "placeholder:text-mist-500 transition-colors duration-200 " +
  "hover:border-white/[0.16] focus:border-accent-300/60 focus:outline-none";

const labelClass = "mb-2 block text-xs font-medium tracking-wide text-mist-400 uppercase";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "whatsapp" }
  | { kind: "error"; message: string };

/**
 * Sending posts to /api/contact, which stores the enquiry so it appears in
 * the admin panel. If the store is unavailable the visitor is pushed to
 * WhatsApp instead, so a message is never silently lost.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const buildFields = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    return {
      name: get("name"),
      email: get("email"),
      company: get("company"),
      type: get("type"),
      budget: get("budget"),
      message: get("message"),
      website: get("website"), // honeypot
    };
  };

  type Fields = ReturnType<typeof buildFields>;

  const buildBody = (f: Fields) =>
    [
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      f.company && `Company: ${f.company}`,
      `Project type: ${f.type}`,
      `Budget: ${f.budget}`,
      "",
      "Details:",
      f.message,
    ]
      .filter(Boolean)
      .join("\n");

  const openWhatsapp = (f: Fields) => {
    window.open(
      `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(buildBody(f))}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "sending") return;

    const form = e.currentTarget;
    const fields = buildFields(form);
    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
      };

      if (response.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }

      // Storage unavailable: hand off to WhatsApp rather than dead-ending
      if (result.code === "store_failed") {
        openWhatsapp(fields);
        setStatus({ kind: "whatsapp" });
        return;
      }

      setStatus({ kind: "error", message: result.error || "Something went wrong." });
    } catch {
      openWhatsapp(fields);
      setStatus({ kind: "whatsapp" });
    }
  };

  const handleWhatsapp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form;
    if (!form) return;

    // Require the same fields the send path does before switching channel
    if (!form.reportValidity()) return;

    openWhatsapp(buildFields(form));
    setStatus({ kind: "whatsapp" });
  };

  const sending = status.kind === "sending";

  return (
    <form onSubmit={handleSubmit} className="glass relative rounded-3xl p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name *
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Jane Cooper"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="company" className={labelClass}>
            Company <span className="normal-case">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Acme Inc."
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>
            What do you need? *
          </label>
          <select id="type" name="type" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select one…
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-ink-900">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className={labelClass}>
            Budget range *
          </label>
          <select id="budget" name="budget" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select one…
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-ink-900">
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Tell me about the project *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="What are you building, who is it for, and is there a deadline?"
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting to bots */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-6 py-3.5 text-sm font-medium text-ink-950 shadow-[0_10px_36px_-10px_rgba(240,180,41,0.45)] transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="mail" className="size-4" />
          {sending ? "Sending…" : "Send message"}
        </button>

        <button
          type="button"
          onClick={handleWhatsapp}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-mist-200 transition-all duration-300 hover:border-emerald-400/40 hover:text-white active:scale-[0.98]"
        >
          <Icon name="whatsapp" className="size-4 text-emerald-400" />
          Send on WhatsApp
        </button>
      </div>

      <p
        aria-live="polite"
        className={`mt-4 min-h-5 text-center text-xs ${
          status.kind === "sent"
            ? "text-emerald-400"
            : status.kind === "error"
              ? "text-ember-400"
              : "text-mist-500"
        }`}
      >
        {status.kind === "idle" &&
          "Goes straight to my desk. I usually reply within a few hours."}
        {status.kind === "sending" && "Sending your message…"}
        {status.kind === "sent" &&
          "Thanks, I have your message. I'll reply to the email you gave me."}
        {status.kind === "whatsapp" && "WhatsApp opened in a new tab with your message ready."}
        {status.kind === "error" && status.message}
      </p>
    </form>
  );
}
