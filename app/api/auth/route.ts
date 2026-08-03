import { NextResponse } from "next/server";
import { endSession, startSession, verifyPassword } from "@/lib/auth";

/**
 * In-memory throttle. Resets on restart and isn't shared across instances -
 * enough to stop casual password guessing on a single-node deployment.
 */
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCKOUT_MS = 10 * 60 * 1000;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const record = attempts.get(key);

  if (record && record.count >= MAX_ATTEMPTS && record.until > Date.now()) {
    const minutes = Math.ceil((record.until - Date.now()) / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutes} minute(s).` },
      { status: 429 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let ok = false;
  try {
    ok = verifyPassword(password);
  } catch (error) {
    // Missing env config: surface it rather than looking like a wrong password
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Auth is misconfigured." },
      { status: 500 },
    );
  }

  if (!ok) {
    const next = record && record.until > Date.now() ? record.count + 1 : 1;
    attempts.set(key, { count: next, until: Date.now() + LOCKOUT_MS });
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(key);
  await startSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await endSession();
  return NextResponse.json({ ok: true });
}
