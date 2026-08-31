import { NextResponse } from "next/server";
import { createEnquiry, type NewEnquiry } from "@/lib/enquiries";

/**
 * Public endpoint for the contact form. Stores the enquiry so it shows up
 * in /admin. No email provider needed.
 */

/**
 * In-memory throttle, same approach as the admin auth route: resets on
 * restart and isn't shared across instances, but it stops one visitor from
 * hammering the form.
 */
const submissions = new Map<string, { count: number; until: number }>();
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 15 * 60 * 1000;

const MAX_LENGTHS: Record<keyof NewEnquiry, number> = {
  name: 120,
  email: 160,
  company: 160,
  type: 120,
  budget: 60,
  message: 5000,
};

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const record = submissions.get(key);
  if (record && record.until > Date.now() && record.count >= MAX_PER_WINDOW) {
    const minutes = Math.ceil((record.until - Date.now()) / 60000);
    return NextResponse.json(
      { error: `Too many messages. Try again in ${minutes} minute(s).` },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Bot trap: a hidden field real visitors never fill in. Answer as if it
  // worked so the bot has no signal to tune against.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const fields: NewEnquiry = {
    name: clean(body.name, MAX_LENGTHS.name),
    email: clean(body.email, MAX_LENGTHS.email),
    company: clean(body.company, MAX_LENGTHS.company),
    type: clean(body.type, MAX_LENGTHS.type),
    budget: clean(body.budget, MAX_LENGTHS.budget),
    message: clean(body.message, MAX_LENGTHS.message),
  };

  const missing = (["name", "email", "type", "budget", "message"] as const).filter(
    (k) => !fields[k],
  );
  if (missing.length) {
    return NextResponse.json(
      { error: `Please fill in: ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return NextResponse.json({ error: "That email address looks invalid." }, { status: 400 });
  }

  try {
    await createEnquiry(fields);
  } catch (error) {
    // Most likely a read-only filesystem (Vercel) with no KV attached.
    // The client falls back to WhatsApp on this code so nothing is lost.
    console.error("Enquiry could not be stored:", error);
    return NextResponse.json(
      { error: "Could not save your message right now.", code: "store_failed" },
      { status: 503 },
    );
  }

  const active = record && record.until > Date.now();
  submissions.set(key, {
    count: active ? record.count + 1 : 1,
    until: active ? record.until : Date.now() + WINDOW_MS,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
